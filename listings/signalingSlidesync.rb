class P2pCdn
  include RedisUtils
  attr_accessor :channel

  def initialize(scope_id, max_mesh_size = 20)
    @client_limit = max_mesh_size.blank? ? 20 : max_mesh_size.to_i
    @presence_expiration = 40
    @channel_prefix = 'p2pCDN'
    @scope_id = scope_id
    @channel = ''
    @session_id = ''
  end

  def join(session_id)
    @mesh = select_peer_mesh
    @session_id = session_id
    @channel = "#{@channel_prefix}/#{@mesh}"
    add_peer
  end

  def remove_old_peers
    current_mesh_id = redis.get(redis.current_mesh_id(@scope_id)).to_i

    (1..current_mesh_id).each do |mesh_id|
      mesh = id_to_mesh(mesh_id)
      peer_mesh_key = redis.peer_mesh_key(@scope_id, mesh)
      peer_ids = redis.smembers(peer_mesh_key)
      peer_ids.each do |peer_id|
        unless redis.exists(redis.p2p_presence_key(peer_id, @scope_id))
          redis.srem(peer_mesh_key, peer_id)
        end
      end
      add(mesh) if ensure_mesh_size(mesh)
    end
  end

  def track_presence(session_id)
    redis.set(
      redis.p2p_presence_key(session_id, @scope_id),
      1,
      { ex: @presence_expiration }
    )
  end

  private

  def select_peer_mesh
    mesh = random_mesh
    unless ensure_mesh_size(mesh)
      remove(mesh)
      return select_peer_mesh
    end
    mesh
  end

  def ensure_mesh_size(mesh)
    peer_count(mesh) < @client_limit
  end

  def peer_count(mesh)
    redis.scard(redis.peer_mesh_key(@scope_id, mesh)).to_i || 0
  end

  def add_peer
    redis.sadd(redis.peer_mesh_key(@scope_id, @mesh), @session_id)
    track_presence(@session_id)
  end

  def next_mesh_id
    mesh_id = redis.incr(redis.current_mesh_id(@scope_id))
    mesh = id_to_mesh(mesh_id)
    add(mesh)
    P2pCdnRemoveOldPeersJob.create({ session_id: @session_id })
    mesh
  end

  def id_to_mesh(id)
    "#{@scope_id}/#{id}"
  end

  def add(mesh)
    redis.lpush(redis.peer_available_meshes_key(@scope_id), mesh)
  end

  def remove(mesh)
    redis.lrem(redis.peer_available_meshes_key(@scope_id), 1, mesh)
  end

  def random_mesh
    redis.lindex(redis.peer_available_meshes_key(@scope_id), 0) || next_mesh_id
  end
end

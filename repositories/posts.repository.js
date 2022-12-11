// models 를 임포트 하는 대신에 postModel을 생성해 테스트한다.(Mock 객체)
class PostRepository {
  constructor(postModel) {
    this.postModel = postModel
  }

  findAllPost = async () => {
    // ORM인 Sequelize에서 생성한 postModel에 findAll 메소드를 사용해 데이터를 요청한다.
    const posts = await this.postModel.findAll()

    return posts
  }
  findPostById = async (postId) => {
    const post = await this.postModel.findByPk(postId)
    return post
  }

  createPost = async (nickname, password, title, content) => {
    // ORM인 Sequelize에서 생성한 postModel에 create 메소드를 사용해 데이터를 요청한다.
    const createPostData = await this.postModel.create({ nickname, password, title, content })

    return createPostData
  }
  updatePost = async (postId, password, title, content) => {
    const updatePostData = await this.postModel.update({ title, content }, { where: { postId, password } })
    return updatePostData
  }
  deletePost = async (postId, password) => {
    const deletePostData = await this.postModel.destroy({ where: { postId, password } })
    return deletePostData
  }
}

module.exports = PostRepository

// Service 계층에선 실제로 데이터를 가공하는 비즈니스 로직을 수행한다.
// 데이터 베이스 내에 접근하기 위해 Repository를 호출해야 한다.
const PostRepository = require("../repositories/posts.repository")

// Posts 모델을 가져온다.
const { Posts } = require("../models/index")

class PostService {
  // PostRepository 인스턴스 생성
  // PostRepository 인스턴스에 Posts 를 전달한다.
  postRepository = new PostRepository(Posts)

  findAllPost = async () => {
    // 저장소(Repository)에게 데이터를 요청한다.
    const allPost = await this.postRepository.findAllPost()

    // 호출한 Post들을 가장 최신 게시글 부터 정렬한다.
    allPost.sort((a, b) => b.createdAt - a.createdAt)

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공한다.
    return allPost.map((post) => {
      return {
        postId: post.postId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      }
    })
  }

  createPost = async (nickname, password, title, content) => {
    // 저장소(Repository)에게 데이터를 요청한다.
    const createPostData = await this.postRepository.createPost(nickname, password, title, content)

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공한다.
    return {
      postId: createPostData.null,
      nickname: createPostData.nickname,
      title: createPostData.title,
      content: createPostData.content,
      createdAt: createPostData.createdAt,
      updatedAt: createPostData.updatedAt,
    }
  }

  deletePost = async (postId, password) => {
    const findPost = await this.postRepository.findPostById(postId)
    if (!findPost) throw new Error("Post doesn`t exist")
    await this.postRepository.deletePost(postId, password)
    return {
      postId: findPost.postId,
      nickname: findPost.nickname,
      title: findPost.title,
      content: findPost.content,
      createdAt: findPost.createdAt,
      updatedAt: findPost.updatedAt,
    }
  }
}

module.exports = PostService

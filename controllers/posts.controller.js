// Controller 에서는 특정 요구사항을 서비스 계층에게 단순한 호출을 하고 컨트롤러에서 받은 결괏값을 사용자에게 보여주는 역할을 한다.

// 서비스 계층에 post 에 해당하는 서비스 모듈을 가져와서 PostService 변수에 할당한다.
const PostService = require("../services/posts.service")

// Post 의 컨트롤러 역할을 하는 클래스
class PostsController {
  // Post 서비스의 클래스를 컨트롤러 클래스의 멤버 변수로 할당, 인스턴스로 생성
  postService = new PostService()

  getPosts = async (req, res, next) => {
    // 서비스 계층에 구현된 findAllPost 로직 실행
    // http 메소드 get, 기본 url 일 때 실행
    const posts = await this.postService.findAllPost()
    res.status(200).json({ data: posts })
  }
  createPost = async (req, res, next) => {
    const { nickname, password, title, content } = req.body

    //서비스 계층에 구현된 createPost 로직 실행
    // http 메소드 post, 기본 url 일 때 실행
    const createPostData = await this.postService.createPost(nickname, password, content)

    res.status(201).json({ data: createPostData })
  }
}

module.exports = PostsController

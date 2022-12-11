// PostRepository 모듈을 가져온다.
const PostRepository = require("../../repositories/posts.repository")

// posts.repository.js 에서는 아래 5개의 Method만을 사용합니다.
// mocking 객체
// 실제 repositories/posts.repository.js에서 사용하는 5개의 Methods
let mockPostsModel = {
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}

// mock객체를 모델로 넘겨 PostRepository 생성
let postRepository = new PostRepository(mockPostsModel)

describe("Layered Architecture Pattern Posts Repository Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks() // 모든 Mock을 초기화합니다.
  })

  test("Posts Repository findAllPost Method", async () => {
    // mockPostsModel 의 findAll 메소드를 테스트
    mockPostsModel.findAll = jest.fn(() => {
      return "findAll Result"
    })
    const posts = await postRepository.findAllPost()

    // findAll 메소드가 1번만 실행 되었는지
    expect(mockPostsModel.findAll).toHaveBeenCalledTimes(1)
    // postsModels 에 있는 findAll Method 결괏값이 바로 return 되는지
    expect(posts).toEqual("findAll Result")
  })

  test("Posts Repository createPost Method", async () => {
    mockPostsModel.create = jest.fn(() => {
      return "Hello Create Result"
    })

    const createPostParams = {
      nickname: "createPostNickname",
      password: "createPostPassword",
      title: "createPostTitle",
      password: "createPostPassword",
    }

    const createPostData = await postRepository.createPost(
      createPostParams.nickname,
      createPostParams.password,
      createPostParams.title,
      createPostParams.content
    )
    // postsModel.create Methods의 결과값은 createPostData 변수와 일치하는지.
    expect(createPostData).toEqual("Hello Create Result")
    // postsModel.create Methods가 1번만 호출되는지
    expect(mockPostsModel.create).toHaveBeenCalledTimes(1)
    // postModel.create Methods를 이용해 생성이 올바르게 되는지
    expect(mockPostsModel.create).toHaveBeenCalledWith({
      nickname: createPostParams.nickname,
      password: createPostParams.password,
      title: createPostParams.title,
      content: createPostParams.content,
    })
  })
})

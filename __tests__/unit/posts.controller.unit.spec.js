const PostsController = require("../../controllers/posts.controller.js")

// posts.service.js 에서는 아래 5개의 Method만을 사용합니다.
let mockPostService = {
  findAllPost: jest.fn(),
  findPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
}

// 하위 계층만 mocking 하는 것이 아닌 req,res 를 mocking 해야한다.
// api 를 구성할 때 req, res, next 세가지 인자를 받는다.
// getPost, createPost 는 req.body의 데이터를 사용하고, res의 status와 json 을 바탕으로 결과가 전달되기 때문이다.
let mockRequest = {
  body: jest.fn(),
}

let mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
}

let postsController = new PostsController()
// postsController의 Service를 Mock Service로 변경합니다.
postsController.postService = mockPostService

describe("Layered Architecture Pattern Posts Controller Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks() // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    // res.status의 결과에 json이 이어지기 때문에 status 의 결과가 undefined 일 경우 에러가 발생하기 때문이다.
    mockResponse.status = jest.fn(() => {
      return mockResponse
    })
  })

  test("Posts Controller getPosts Method by Success", async () => {
    const findAllPostReturnValue = [
      { postId: 1, nickname: "test_nick", title: "test_title", createdAt: new Date("11 December 2022 00:00"), updatedAt: new Date("11 December 2022 00:00") },
      { postId: 2, nickname: "test_nick2", title: "test_title2", createdAt: new Date("11 December 2022 01:00"), updatedAt: new Date("11 December 2022 01:00") },
    ]
    mockPostService.findAllPost = jest.fn(() => {
      return findAllPostReturnValue
    })
    await postsController.getPosts(mockRequest, mockResponse)

    // findAllPost가 1번 호출
    expect(mockPostService.findAllPost).toHaveBeenCalledTimes(1)
    // res.status 가 200으로 전달
    expect(mockResponse.status).toHaveBeenCalledTimes(1)
    expect(mockResponse.status).toHaveBeenCalledWith(200)
    // res.json dl {data: posts} 형태로 전달
    expect(mockResponse.json).toHaveBeenCalledWith({ data: findAllPostReturnValue })
  })

  test("Posts Controller createPost Method by Success", async () => {
    const createPostBodyParams = { nickname: "nick_success", password: "PW_success", title: "title_success", content: "content_success" }
    // req.body는 객체구조분해할당으로 바로 변수로 선언한 것이기 때문에 mocking을 할 수 없다.
    mockRequest.body = createPostBodyParams
    const createPostReturnValue = {
      postId: 1,
      nickname: "nick_1",
      title: "title_1",
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    }
    mockPostService.createPost = jest.fn(() => {
      return createPostReturnValue
    })
    await postsController.createPost(mockRequest, mockResponse)
    // req.body 데이터 전달

    expect(mockPostService.createPost).toHaveBeenCalledTimes(1)
    expect(mockPostService.createPost).toHaveBeenCalledWith(
      createPostBodyParams.nickname,
      createPostBodyParams.password,
      createPostBodyParams.title,
      createPostBodyParams.content
    )
    // mockResponse.json === createPostReturnValue
    expect(mockResponse.json).toHaveBeenCalledTimes(1)
    expect(mockResponse.json).toHaveBeenCalledWith({ data: createPostReturnValue })
    // mockResponse.status 201인지
    expect(mockResponse.status).toHaveBeenCalledWith(201)
  })

  test("Posts Controller createPost Method by Invalid Params Error", async () => {
    mockRequest.body = {}
    await postsController.createPost(mockRequest, mockResponse)

    // mock res status 가 400번
    expect(mockResponse.status).toHaveBeenCalledWith(400)
    // mock res.json 이 {errorMessage : "InvalidParamsError"}
    expect(mockResponse.json).toHaveBeenCalledWith({ errorMessage: "InvalidParamsError" })
  })
})

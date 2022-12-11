const PostService = require("../../services/posts.service.js")

// repository mocking
let mockPostsRepository = {
  findAllPost: jest.fn(),
  findPostById: jest.fn(),
  createPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn(),
}

let postService = new PostService()
// service/posts.service.js 에서 생성한 인스턴스
// postService의 Repository를 Mock Repository로 변경합니다.
postService.postRepository = mockPostsRepository

describe("Layered Architecture Pattern Posts Service Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks() // 모든 Mock을 초기화합니다.
  })

  test("Posts Service findAllPost Method", async () => {
    // service 에서의 반환된 결과값이 map을 사용한 배열이기 때문
    const findAllPostReturnValue = [
      { postId: 1, nickname: "test_nick", title: "test_title", createdAt: new Date("11 December 2022 00:00"), updatedAt: new Date("11 December 2022 00:00") },
      { postId: 2, nickname: "test_nick2", title: "test_title2", createdAt: new Date("11 December 2022 01:00"), updatedAt: new Date("11 December 2022 01:00") },
    ]
    mockPostsRepository.findAllPost = jest.fn(() => {
      return findAllPostReturnValue
    })
    const allPost = await postService.findAllPost()
    expect(allPost).toEqual(findAllPostReturnValue.sort((a, b) => b.createdAt - a.createdAt))
    expect(mockPostsRepository.findAllPost).toHaveBeenCalledTimes(1)
  })

  test("Posts Service deletePost Method By Success", async () => {
    const findPostByIdReturnValue = {
      postId: 1,
      nickname: "test_nick",
      title: "test_title",
      content: "testcontent",
      createdAt: new Date("11 December 2022 00:00"),
      updatedAt: new Date("11 December 2022 00:00"),
    }
    mockPostsRepository.findPostById = jest.fn(() => {
      return findPostByIdReturnValue
    })
    const deletePost = await postService.deletePost(1, "0000")
    // findPostById Methods를 1번 호출, 입력받는 인자는 postId
    expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1)
    expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(1)
    // postId, password, deletePost Method 호출
    expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(1)
    expect(mockPostsRepository.deletePost).toHaveBeenCalledWith(1, "0000")
    // Return 된 결과값이 findPostById 의 반환된 결과값과 일치
    expect(deletePost).toMatchObject({
      postId: 1,
      nickname: "test_nick",
      title: "test_title",
      content: "testcontent",
      createdAt: new Date("11 December 2022 00:00"),
      updatedAt: new Date("11 December 2022 00:00"),
    })
  })

  test("Posts Service deletePost Method By Not Found Post Error", async () => {
    const findPostByIdReturnValue = null
    mockPostsRepository.findPostById = jest.fn(() => {
      return findPostByIdReturnValue
    })

    try {
      const deletePost = await postService.deletePost(90, "123123")
    } catch (error) {
      // postId 를 입력한 findPostById 실행
      expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1)
      expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(90)
      // 반환된 findPostById 의 결과가 존재하지 않을 때 에러 발생
      expect(error.message).toEqual("Post doesn`t exist")
    }
  })
})

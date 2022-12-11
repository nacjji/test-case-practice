const supertest = require("supertest")
const app = require("../../app.js")
const { sequelize } = require("../../models/index.js")

// 통합 테스트(Integration Test)를 진행하기에 앞서 Sequelize에 연결된 모든 테이블의 데이터를 초기화한다.
//  단, NODE_ENV가 test 환경으로 설정되어있는 경우에만 데이터를 초기화한다.
// test일 경우 db를 초기화하는 설정이기 때문에 이 부분이 없으면 test db 가 아닌 기존 db가 삭제되기 때문에 주의하자.
beforeAll(async () => {
  // testcode 를 실행했을 때 시작하자마자 실행되는 sequelize.sync()
  if (process.env.NODE_ENV === "test") await sequelize.sync()
  else throw new Error("NODE_ENV가 test 환경으로 설정되어 있지 않습니다.")
})

describe("Layered Architecture Pattern, Posts Domain Integration Test", () => {
  // getPosts 컨트롤러의 메소드 실행
  test("GET /api/posts API (getPosts) Integration Test Success Case, Not Found Posts Data", async () => {
    const response = await supertest(app).get(`/api/posts`) // API의 HTTP Method & URL
    // api status code 가 200 번일 때
    expect(response.status).toEqual(200)
    // api response 데이터는 {data: []}
    expect(response.body).toEqual({ data: [] })
  })
  //  createPost
  test("POST /api/posts API (createPost) Integration Test Success Case", async () => {
    const createPostBodyParams = { nickname: "nick_success", password: "PW_success", title: "title_success", content: "content_success" }

    const response = await supertest(app).post("/api/posts").send(createPostBodyParams)

    //   http status code 가 201 로 전달되는지
    expect(response.status).toEqual(201)
    //   원하는 형태로 전달 {postId, nickname, title, content, createdAt, updatedAt} 되는지
    expect(response.body).toMatchObject({
      data: {
        postId: 1,
        nickname: createPostBodyParams.nickname,
        title: createPostBodyParams.title,
        content: createPostBodyParams.content,
        // 어떤 값이든 상관없이 createdAt과 updatedAt 에 값이 존재하는지만 본다.
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      },
    })
  })

  test("POST /api/posts API (createPost) Integration Test Error Case, Invalid Params Error", async () => {
    const response = await supertest(app).post("/api/posts").send()

    // http status code 가 400번으로 전달 되었을 때
    expect(response.status).toEqual(400)
    // {errorMassage : error.message} 일 때
    expect(response.body).toEqual({ errorMessage: "InvalidParamsError" })
  })

  test("GET /api/posts API (getPosts) Integration Test Success Case, is Exist Posts Data", async () => {
    // TODO: 여기에 코드를 작성해야합니다.
  })
})

// 테스트가 종료했을 때 sequelize와 연결된 테이블의 데이터 삭제
afterAll(async () => {
  if (process.env.NODE_ENV === "test") await sequelize.sync({ force: true })
  else throw new Error("NODE_ENV가 test 환경으로 설정되어 있지 않습니다.")
})

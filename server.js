const grpc = require("@grpc/grpc-js"); // loading the proto file
const protoLoader = require("@grpc/proto-loader"); // loading the proto file

const packageDef = protoLoader.loadSync("todo.proto", {}); // inital configuration

const grpcObject = grpc.loadPackageDefinition(packageDef); // loading the package definition

const todoPackage = grpcObject.todoPackage; // loading the todo package

const server = new grpc.Server(); // create a new gRPC server

server.bindAsync(
  "0.0.0.0:4500",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
); // bind the server to port 40000
server.addService(todoPackage.Todo.service, {
  createTodo,
  readTodos,
  readTodoStrem,
}); // add the todo service to the server

const todos = [];

function createTodo(call, callback) {
  const todoItem = {
    id: todos.length,
    text: call.request.text,
  };
  todos.push(todoItem);

  callback(null, todoItem); // returning the response like this

  console.log("Received: ", call.request);
}

function readTodoStrem(call, callback) {
  todos.forEach((todo) => {
    call.write(todo); // send the data to the client
  });

  // call.write(todos); // wait no no you can't send array of data to the client its should be sinlge value in steam.

  call.end(); // end the stream after all data has been sent
}

// function readTodoStrem(call) {
//   const todoList = { items: todos };
//   call.write(todoList);
//   call.end();
// }

function readTodos(call, callback) {
  console.log("todos", todos);
  callback(null, { items: todos }); // returning the response like this
}

const grpc = require("@grpc/grpc-js"); // loading the proto file
const protoLoader = require("@grpc/proto-loader"); // loading the proto file

const packageDef = protoLoader.loadSync("todo.proto", {}); // inital configuration

const grpcObject = grpc.loadPackageDefinition(packageDef); // loading the package definition

const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo(
  "localhost:4500",
  grpc.credentials.createInsecure()
);

const text = process.argv[2]; // reading from terminal

client.createTodo(
  {
    id: -1,
    text: text,
  },
  (err, res) => {
    if (err) {
      console.error("Error creating TODO:", err);
    } else {
      console.log("Create TODO Response: ", JSON.stringify(res));
    }
  }
);

// client.readTodos({}, (err, response) => {
//   if (err) {
//     console.error("Error reading todos:", err);
//   } else {
//     console.log("Read Todos Response: ", JSON.stringify(response));
//     if (response.items) {
//       response.items.forEach((a) => console.log(a.text));
//     } else {
//       console.log("No items found");
//     }
//   }
// });

const call = client.readTodoStrem(); // this is not a call back its stream.

// this is something we use to do on nodejs with express server reading the data
call.on("data", (response) => {
  console.log("Received: ", response);
  if (response.items) {
    response.items.forEach((a) => console.log(a.text));
  } else {
    console.log("No items found");
  }
});

// we need to define this end method to close the stream
call.on("end", () => console.log("Finished reading todos"));

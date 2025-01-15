const {
  GetItemCommand,
  PutItemCommand,
  DeleteItemCommand,
} = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const { dynamodbClient } = require("../aws/clients");
const { AppError } = require("../middlewares/middleware");

const signup = async ({ userId, email, firstName, lastName }) => {
  const command = new PutItemCommand({
    id: userId,
    email,
    firstName,
    lastName,
  });
  const response = await dynamodbClient.send(command);
  return {
    status: 201,
    response: {
      status: "success",
      message: "User Added successfully",
      data: {},
    },
  };
};

const getUser = async ({ userId }) => {
  const key = marshall({ userId });
  const command = new GetItemCommand({
    TableName: "streambridge_user",
    Key: key,
  });
  const response = await dynamodbClient.send(command);
  if (!response.Item) {
    throw new AppError("User not found", 404);
  }
  const user = unmarshall(response.Item);
  return {
    status: 200,
    response: {
      success: true,
      message: "User found",
      data: { user },
    },
  };
};

const deleteUser = async ({ userId }) => {
  const key = marshall({ userId });
  const command = new DeleteItemCommand({
    TableName: "streambridge_user",
    Key: key,
  });
  const response = await dynamodbClient.send(command);
  if (!response.Item) {
    throw new AppError("User not found", 404);
  }
  return {
    status: 204,
    response: {
      success: true,
      message: "User deleted",
      data: {},
    },
  };
};

module.exports = { signup, getUser, deleteUser };

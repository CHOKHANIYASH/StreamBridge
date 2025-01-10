exports.handler = async function (event, context) {
  console.log("event  ", event);
  const { ECSClient, RunTaskCommand } = require("@aws-sdk/client-ecs");
  const client = new ECSClient({
    region: "ap-south-1",
  });
  for (Record of event.Records) {
    try {
      const eventName = JSON.parse(Record.body).Records[0].eventName;
      const s3Event = JSON.parse(Record.body).Records[0].s3;
      if (!s3Event) continue;
      const bucketName = s3Event.bucket.name;
      const objectKey = s3Event.object.key;
      console.log("event name  ", eventName);
      if (eventName === "s3:TestEvent") {
        continue;
      }
      console.log(`New file ${objectKey} has been uploaded to ${bucketName}`);
      const command = new RunTaskCommand({
        taskDefinition:
          "arn:aws:ecs:ap-south-1:586794464737:task-definition/video-transcoder",
        cluster: "arn:aws:ecs:ap-south-1:586794464737:cluster/streambridge2",
        launchType: "FARGATE",
        networkConfiguration: {
          awsvpcConfiguration: {
            assignPublicIp: "ENABLED",
            securityGroups: ["sg-0cecf707b093e673c"],
            subnets: [
              "subnet-07f11f5dd9def95bb",
              "subnet-0b76048bc0360fbee",
              "subnet-0266aa44569cae4dd",
            ],
          },
        },
        overrides: {
          containerOverrides: [
            {
              name: "video-transcoder",
              environment: [
                {
                  name: "OBJECT_KEY",
                  value: objectKey,
                },
              ],
            },
          ],
        },
      });
      console.log("running task");
      const response = await client.send(command).catch((err) => {
        console.log("error inside ", err);
      });
      console.log("response  = ", response);
    } catch (err) {
      console.log("error  ", err);
    }
  }
  return context.logStreamName;
};

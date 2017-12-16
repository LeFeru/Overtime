using MongoDB.Bson;
using System.Collections;
using System.Collections.Generic;

namespace Overtime.Models
{
    public class TaskModel
    {
        public string Owner { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public int Severity { get; set; }
        public string State { get; set; }
        public string EstimatedTime { get; set; }
        public BsonDocument toBsonDocument()
        {
            IDictionary project = new Dictionary<string, object>();
            project.Add("owner", this.Owner);
            project.Add("title", this.Title);
            project.Add("description", this.Description);
            project.Add("type", this.Type);
            project.Add("severity", this.Severity);
            project.Add("state", this.State);
            project.Add("estimatedTime", this.EstimatedTime);
            BsonDocument bsonUser = new BsonDocument(project);
            return bsonUser;
        }

        public void fromBsonDocument(BsonDocument bsonDocument)
        {
            this.Owner = bsonDocument.GetValue("owner", null).AsString;
            this.Title = bsonDocument.GetValue("title", null).AsString;
            this.Description = bsonDocument.GetValue("description", null).AsString;
            this.Type = bsonDocument.GetValue("type", null).AsString;
            this.Severity = bsonDocument.GetValue("severity", null).AsInt32;
            this.State = bsonDocument.GetValue("state", null).AsString;
            this.EstimatedTime = bsonDocument.GetValue("estimatedTime", null).AsString;
        }
    }
}

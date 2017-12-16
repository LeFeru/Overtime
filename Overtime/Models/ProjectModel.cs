using MongoDB.Bson;
using System.Collections;
using System.Collections.Generic;

namespace Overtime.Models
{
    public class ProjectModel
    {
        public string Owner { get; set; }
        public string Author { get; set; }
        public string Title { get; set; }
        public string Deadline { get; set; }
        public int Priority { get; set; }
        public int NumberOfTasks { get; set; }
        public int NumberOfTasksCompleted { get; set; }
        public BsonDocument toBsonDocument()
        {
            IDictionary project = new Dictionary<string, object>();
            project.Add("owner", this.Owner);
            project.Add("author", this.Author);
            project.Add("title", this.Title);
            project.Add("deadline", this.Deadline);
            project.Add("priority", this.Priority);
            project.Add("numberOfTasks", this.NumberOfTasks);
            project.Add("numberOfTasksCompleted", this.NumberOfTasksCompleted);
            BsonDocument bsonUser = new BsonDocument(project);
            return bsonUser;
        }

        public void fromBsonDocument(BsonDocument bsonDocument)
        {
            this.Owner = bsonDocument.GetValue("owner", null).AsString;
            this.Author = bsonDocument.GetValue("author", null).AsString;
            this.Title = bsonDocument.GetValue("title", null).AsString;
            this.Deadline = bsonDocument.GetValue("deadline", null).AsString;
            this.Priority = bsonDocument.GetValue("priority", null).AsInt32;
            this.NumberOfTasks = bsonDocument.GetValue("numberOfTasks", null).AsInt32;
            this.NumberOfTasksCompleted = bsonDocument.GetValue("numberOfTasksCompleted", null).AsInt32;
        }
    }
}

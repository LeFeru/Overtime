using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Overtime.Models
{
    public class DataAccess
    {
        protected static IMongoClient _client;
        protected static IMongoDatabase _database;
        public DataAccess()
        {
            _client = new MongoClient("mongodb://LeFeru:JLCollinet2018_@overtime001-shard-00-00-efuge.mongodb.net:27017,overtime001-shard-00-01-efuge.mongodb.net:27017,overtime001-shard-00-02-efuge.mongodb.net:27017/test?ssl=true&replicaSet=Overtime001-shard-0&authSource=admin");
            _database = _client.GetDatabase("UsersDB");
        }

        public async void insertProject(ProjectModel project)
        {
            var collection = _database.GetCollection<BsonDocument>("projects");
            await collection.InsertOneAsync(project.toBsonDocument());
        }
        public async void insertTask(TaskModel task)
        {
            var collection = _database.GetCollection<BsonDocument>("tasks");
            await collection.InsertOneAsync(task.toBsonDocument());
            collection = _database.GetCollection<BsonDocument>("projects");
            var filter = Builders<BsonDocument>.Filter;
            var filters = filter.And(filter.Eq("owner", task.Owner), filter.Eq("title", task.Title));
            var update = Builders<BsonDocument>.Update.Inc("numberOfTasks", 1);
            await collection.UpdateOneAsync(filters, update);
        }
        public async void updateTask(TaskModel task)
        {
            var collection = _database.GetCollection<BsonDocument>("tasks");
            var filter = Builders<BsonDocument>.Filter;
            var filters = filter.And(filter.Eq("owner", task.Owner), filter.Eq("title", task.Title), filter.Eq("description", task.Description), filter.Eq("state", "To Do"));
            var update = Builders<BsonDocument>.Update.Set("state", "Done");
            await collection.UpdateOneAsync(filters, update);
            collection = _database.GetCollection<BsonDocument>("projects");
            filter = Builders<BsonDocument>.Filter;
            filters = filter.And(filter.Eq("owner", task.Owner), filter.Eq("title", task.Title));
            update = Builders<BsonDocument>.Update.Inc("numberOfTasksCompleted", 1);
            await collection.UpdateOneAsync(filters, update);
        }
        public async void removeTask(TaskModel task)
        {
            var collection = _database.GetCollection<BsonDocument>("tasks");
            await collection.DeleteOneAsync(task.toBsonDocument());
        }
        public async void removeProject(ProjectModel project)
        {
            var bson = new BsonDocument();
            bson.Add("owner", project.Owner);
            bson.Add("title", project.Title);
            var collection = _database.GetCollection<BsonDocument>("projects");
            await collection.DeleteOneAsync(bson);
            collection = _database.GetCollection<BsonDocument>("tasks");
            await collection.DeleteManyAsync(bson);
        }
        public async Task<List<ProjectModel>> FindProjects(string owner)
        {
            var collection = _database.GetCollection<BsonDocument>("projects");
            var filter = Builders<BsonDocument>.Filter.Eq("owner", owner);
            try
            {
                List<ProjectModel> projects = new List<ProjectModel>();
                await collection.Find(filter).ForEachAsync(doc =>
                {
                    Console.WriteLine(doc);
                    ProjectModel project = new ProjectModel();
                    project.fromBsonDocument(doc);
                    projects.Add(project);
                });
                return projects;
            }
            catch (System.Exception)
            {
                return null;
            }
        }
        public async void InsertUser(UserModel user)
        {
            var collection = _database.GetCollection<BsonDocument>("users");
            await collection.InsertOneAsync(user.toBsonDocument());
        }
        public UserModel FindUser(string email)
        {
            var collection = _database.GetCollection<BsonDocument>("users");
            var filter = Builders<BsonDocument>.Filter.Eq("email", email);
            try
            {
                BsonDocument result = collection.FindSync(filter).Single();
                UserModel user = new UserModel();
                user.fromBsonDocument(result);
                return user;
            }
            catch (System.Exception)
            {
                return null;
            }
        }

        public async Task<List<TaskModel>> FindTasks(string owner, string title)
        {
            var collection = _database.GetCollection<BsonDocument>("tasks");
            var bsonDoc = new BsonDocument();
            bsonDoc.Add(new BsonElement("title", title));
            bsonDoc.Add(new BsonElement("owner", owner));
            try
            {
                List<TaskModel> tasks = new List<TaskModel>();
                await collection.Find(bsonDoc).ForEachAsync(doc =>
                {
                    Console.WriteLine(doc);
                    TaskModel task = new TaskModel();
                    task.fromBsonDocument(doc);
                    tasks.Add(task);
                });
                return tasks;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            return null;
        }
    }
}

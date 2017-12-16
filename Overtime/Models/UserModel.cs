using MongoDB.Bson;
using System.Collections;
using System.Collections.Generic;

namespace Overtime.Models
{
    public class UserModel
    {
        public string Email { get; set; }
        public string Password { get; set; }

        public BsonDocument toBsonDocument()
        {

            IDictionary user = new Dictionary<string, object>();
            user.Add("email", this.Email);
            user.Add("password", this.Password);
            BsonDocument bsonUser = new BsonDocument(user);
            return bsonUser;
        }

        public void fromBsonDocument(BsonDocument bsonDocument)
        {
            this.Email = bsonDocument.GetValue("email", null).AsString;
            this.Password = bsonDocument.GetValue("password", null).AsString;
        }
    }
}

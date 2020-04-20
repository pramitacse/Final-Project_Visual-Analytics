from pymongo import MongoClient


def getAllFeatures_billboard():
    print("getFeatures")
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.billboardMusicCollection

    isSuccess = collection.find({"track": "wooly_bully"}, {"_id": 0})
    print(isSuccess[0])
    return isSuccess

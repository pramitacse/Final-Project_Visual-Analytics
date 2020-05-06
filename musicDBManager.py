from pymongo import MongoClient
import os
import json
import numpy
import pandas as pd
import myNLProcessing

img_directory_path = "./static/img/"

RANKTOP20 = [str(i) for i in range(1, 21)]


def getBillboard(startDate, endDate):
    result = getAllMusic_billboard(startDate, endDate)
    # img_result = getAllImages()

    billboard_data = []

    for row in result:
        row["image_path"] = img_directory_path + row["track"] + ".jpg"
        billboard_data.append(row)

    return billboard_data


def getTop50():
    result = getAllMusic_top50()
    # img_result = getAllImages()

    top50_data = []

    for row in result:
        row["image_path"] = img_directory_path + row["track"] + ".jpg"
        top50_data.append(row)

    return top50_data


def getAllMusic_billboard(startDate, endDate):
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.billboardMusicCollection

    isSuccess = collection.find({"rank": {"$in": RANKTOP20}, "releaseDate": {"$gte": startDate,  "$lt": endDate}}, {
                                "_id": 0, "lyrics": 0, "image_url": 0}).sort("releaseDate", -1)
    return isSuccess


def getAllMusic_top50():
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.top50MusicCollection

    isSuccess = collection.find(
        {}, {"_id": 0, "lyrics": 0, "image_url": 0}).sort("releaseDate")
    return isSuccess


def getFeatureData(feature, startDate, endDate):
    billboard_feature = getFeatrue_billboard(feature, startDate, endDate)
    top50_feature = getFeatrue_top50(feature)

    top50 = []
    billboard = []
    # ////////
    # need to add a column which are from billboard and which are from top50
    # to draw later
    for row in top50_feature:
        # row["source"] = "top50"
        top50.append(row)

    for row in billboard_feature:
        # row["source"] = "billboard"
        billboard.append(row)

    feature_data = [{"top50": top50, "billboard": billboard}]

    return feature_data


def getFeatrue_top50(feature):
    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.top50MusicCollection

    isSuccess = collection.find({}, {"_id": 0, "track": 1, feature: 1})

    return isSuccess


def getFeatrue_billboard(feature, startDate, endDate):
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.billboardMusicCollection

    isSuccess = collection.find({"rank": {"$in": RANKTOP20}, "releaseDate": {"$gte": startDate,  "$lt": endDate}}, {
                                "_id":  0, "track": 1, feature: 1})
    return isSuccess


def getKeywords():
    keywords_billboard = getKeywords_billboard()
    keywords_top50 = getKeywords_top50()

    # top50 = []
    # billboard = []
    # # ////////
    # # need to add a column which are from billboard and which are from top50
    # # to draw later
    # for row in top50_feature:
    #     # print(row)
    #     # row["source"] = "top50"
    #     top50.append(row)

    # for row in billboard_feature:
    #     # row["source"] = "billboard"
    #     billboard.append(row)

    keywrods_data = [{"top50": keywords_top50,
                      "billboard": keywords_billboard}]

    return keywrods_data


def getKeywords_billboard(startDate, endDate):
    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.billboardMusicCollection

    isSuccess = collection.find({"rank": {"$in": RANKTOP20}, "releaseDate": {"$gte": startDate,  "$lt": endDate}}, {
                                "_id":  0, "preprocessed_lyrice": 1})
    billboard_keywords = myNLProcessing.wordCloudDataProcessing_TFIDF(
        isSuccess)

    return billboard_keywords


def getKeywords_top50():
    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.top50MusicCollection

    isSuccess = collection.find({}, {"_id":  0, "preprocessed_lyrice": 1})
    top50_keywords = myNLProcessing.wordCloudDataProcessing_TFIDF(isSuccess)

    return top50_keywords
# ////////////////////////////////////////


def getTrackImages(track):
    return "image"


def getATrackImage(track):
    return img_directory_path + track + ".jpg"


def getTrackByFeatures_billboard():
    print("getFeatures")
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.billboardMusicCollection

    isSuccess = collection.find({}, {
                                "_id": 0, "image_url": 0})
    # print(isSuccess[0])
    return isSuccess


def getTrackByYearRange_billboard():
    print("getFeatures")
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.billboardMusicCollection

    isSuccess = collection.find({"track": "wooly_bully"}, {"_id": 0})
    print(isSuccess[0])
    return isSuccess


def getFeaturesByTrack_billboard():
    print("getFeatures")
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.billboardMusicCollection

    isSuccess = collection.find({"track": "wooly_bully"}, {"_id": 0})
    print(isSuccess[0])
    return isSuccess


def getTrackByYear_billboard():
    print("getFeatures")
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.billboardMusicCollection

    isSuccess = collection.find({"track": "wooly_bully"}, {"_id": 0})
    print(isSuccess[0])
    return isSuccess


def getTrackByArtist_billboard():
    print("getFeatures")
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.billboardMusicCollection

    isSuccess = collection.find({"track": "wooly_bully"}, {"_id": 0})
    print(isSuccess[0])
    return isSuccess


# worked up to here
# below does not work properly


def getTrackByFeatures_top50():
    print("getFeatures")
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.top50MusicCollection

    isSuccess = collection.find({"track": "wooly_bully"}, {"_id": 0})
    print(isSuccess[0])
    return isSuccess


def getTrackByYearRange_top50():
    print("getFeatures")
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.top50MusicCollection

    isSuccess = collection.find({"track": "wooly_bully"}, {"_id": 0})
    print(isSuccess[0])
    return isSuccess


def getFeaturesByTrack_top50():
    print("getFeatures")
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.top50MusicCollection

    isSuccess = collection.find({"track": "wooly_bully"}, {"_id": 0})
    print(isSuccess[0])
    return isSuccess


def getTrackByYear_top50():
    print("getFeatures")
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.top50MusicCollection

    isSuccess = collection.find({"track": "wooly_bully"}, {"_id": 0})
    print(isSuccess[0])
    return isSuccess


def getTrackByArtist_top50():
    print("getFeatures")
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.top50MusicCollection

    isSuccess = collection.find({"track": "wooly_bully"}, {"_id": 0})
    print(isSuccess[0])
    return isSuccess

from pymongo import MongoClient
import os
import json
import numpy
import pandas as pd

img_directory_path = "./static/img/"


def getBillboard():
    result = getAllFeatures_billboard()
    # img_result = getAllImages()

    billboard_data = []

    for row in result:
        row["image_path"] = img_directory_path + row["track"] + ".jpg"
        billboard_data.append(row)

    return billboard_data


def getTop50():
    result = getAllFeatures_top50()
    # img_result = getAllImages()

    top50_data = []

    for row in result:
        row["image_path"] = img_directory_path + row["track"] + ".jpg"
        top50_data.append(row)

    return top50_data


def getAllFeatures_billboard():
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.billboardMusicCollection

    isSuccess = collection.find({}, {"_id": 0, "lyrics": 0, "image_url": 0})
    return isSuccess


def getAllFeatures_top50():
    # print(dataList)

    client = MongoClient(
        "mongodb+srv://handy:ehddbs113@cluster0-siplm.mongodb.net/test?retryWrites=true&w=majority")
    db = client.MusicDB
    collection = db.top50MusicCollection

    isSuccess = collection.find({}, {"_id": 0, "lyrics": 0, "image_url": 0})
    return isSuccess


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


def getAllImage_billboard():
    return "getAllImage_billboard"


def getAllImage_top50():
    return "getAllImage_top50"


def getImage(track):
    return "trackImage"


def getAllImage():
    billboardImages = getAllImage_billboard()
    top50Images = getAllImage_top50()

    return "billboard + top50 images"

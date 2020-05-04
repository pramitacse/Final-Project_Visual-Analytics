from textblob import Word
from textblob import TextBlob
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.tokenize import TreebankWordTokenizer
from gensim.summarization import keywords
import re
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
import json
from sklearn.feature_extraction.text import CountVectorizer

import nltk
import unidecode

nltk.download('punkt')

# from nltk.stem import PorterStemmer


tokenizer = TreebankWordTokenizer()
stop_words = set(stopwords.words('english'))
stop_words2 = ["''", '""', "``", "...", "'s", "1",
               "2", "3", "4", "5", "6", "7", "8", "9", "0"]
# s = PorterStemmer()
cv = CountVectorizer()


def removeDuplication(temp):
    no_duplicateList = []
    bigram_list = []
    unigram_list = []

    for i in range(len(temp)):
        if len(temp[i]["keyword"].split()) > 1:
            bigram_list.append(temp[i])
        else:
            unigram_list.append(temp[i])

    for i in bigram_list:
        keyword = i["keyword"]
        score = i["score"]

        for j in unigram_list[:]:
            if j["keyword"] in keyword:
                score = max(score, j["score"])
                unigram_list.remove(j)

        i["score"] = score

    while len(bigram_list) != 0 and len(unigram_list) != 0:
        if(bigram_list[0]["score"] > unigram_list[0]["score"]):
            keyword = bigram_list[0]["keyword"]
            score = bigram_list[0]["score"]
            bigram_list.remove(bigram_list[0])
        else:
            keyword = unigram_list[0]["keyword"]
            score = unigram_list[0]["score"]
            unigram_list.remove(unigram_list[0])

        tempObj = {"keyword": keyword, "score": score}
        no_duplicateList.append(tempObj)

    if(len(bigram_list) == 0):
        for i in unigram_list:
            keyword = i["keyword"]
            score = i["score"]
            tempObj = {"keyword": keyword, "score": score}
            no_duplicateList.append(tempObj)
    elif(len(unigram_list) == 0):
        for i in bigram_list:
            keyword = i["keyword"]
            score = i["score"]
            tempObj = {"keyword": keyword, "score": score}
            no_duplicateList.append(tempObj)

    return no_duplicateList


# def textPreprocessing(text):
#     result = ""
#     word_tokens = tokenizer.tokenize(text)

#     filtered_sentence = []

#     for w in word_tokens:
#         w = w.lower()
#         if w not in stop_words and w not in stop_words2 and len(w) != 1:
#             filtered_sentence.append(w)

#     # stemmed_sentence = [s.stem(w) for w in filtered_sentence]

#     # result = " ".join(stemmed_sentence)
#     result = " ".join(filtered_sentence)

#     return result

def textPreprocessing(text):
    result = ""
#     word_tokens = tokenizer.tokenize(text)
    word_tokens = TextBlob(text).words

    # preprocessed_word = []

#     for word in word_tokens:
#         word = unidecode.unidecode(word)
# #         word = Word(word).lemmatize()

#         # if word not in stop_words and word not in stop_words2 and len(word) != 1:
#             word = word
#             # word = Word(word).lemmatize()

#             preprocessed_word.append(word)

#         preprocessed_word.append(word.singularize())

    result = " ".join(word_tokens)

    return result


def get_top_tf_idf_words(feature_names, response, top_n=10):
    try:
        sorted_nzs = np.argsort(response.data)[:-(top_n+1):-1]

        keywords = feature_names[response.indices[sorted_nzs]]
        scores = [response.data[idx] for idx in sorted_nzs]

        temp = [{"keyword": keyword, "score": score}
                for keyword, score in zip(keywords, scores)]

        temp = removeDuplication(temp)
    except:
        temp = get_top_tf_idf_words(feature_names, response, top_n-10)

    return temp


def wordCloudDataProcessing_TFIDF(data):
    corpus = []
    totalCorpus = ""

    for item in data:
        corpus.append(textPreprocessing(item["preprocessed_lyrice"]))
        totalCorpus = totalCorpus + "/n" + \
            textPreprocessing(item["preprocessed_lyrice"])

    # print(totalCorpus)

    bgs = nltk.word_tokenize(totalCorpus)
    fdist = nltk.FreqDist(bgs)

    vocab = fdist.most_common(50)
    keywords = []

    for word in vocab:
        keywords.append(word[0])

    return keywords
# vocab[:100]
    # print(fdist.most_common(50))

    # vectorizer = TfidfVectorizer(stop_words='english', lowercase=True, ngram_range=(
    #     2, 2), norm='l2', use_idf=True, smooth_idf=True)

    # X = vectorizer.fit_transform(corpus)
    # X_total = vectorizer.fit_transform([totalCorpus])

    # feature_names = np.array(vectorizer.get_feature_names())
    # responses = vectorizer.transform(corpus)
    # responses_total = vectorizer.transform([totalCorpus])

    # workList = []

    # for item, response in zip(data, responses):
    #     # for item in data:
    #     tempObject = {}
    #     tempObject["_id"] = item["title"]
    #     tempObject["title"] = item["title"]
    #     tempObject["roomTheme"] = item["roomTheme"]
    #     tempObject["artist"] = item["artist"]

    #     tempObject["PaintingKeywords"] = get_top_tf_idf_words(
    #         feature_names, response, 40)

    #     workList.append(tempObject)
    #     # dictKeyword = [get_top_tf_idf_words(response, 10) for response in responses]

    # # print(get_top_tf_idf_words(feature_names, responses_total, 40))

    # # cv_fit = cv.fit_transform([totalCorpus]).toarray()
    # # word_list = cv.get_feature_names()

    # # tempList = []
    # # for word, count in zip(word_list, cv_fit[0]):
    # #     tempList.append({"word": word, "tf": count})

    # # newlist = sorted(tempList, key=lambda x: x["tf"], reverse=True)
    # # print(newlist)
    # # print(cv_fit.toarray())  # .sort()

    # # myDBmanager.upsertData2DB(workList)


def wordCloudDataProcessing_Doc2Vec(data):
    # print(data)

    for item in data:
        print(item["title"])
        # break

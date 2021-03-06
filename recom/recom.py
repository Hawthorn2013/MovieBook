# -*- coding: utf-8 -*-

import pickle
import sys, json

# dataToSendBack = [[1],['1']]
# print(dataToSendBack)
# sys.stdout.flush()

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])

def getRecommendedItems(prefs, itemMatch, user):
    userRatings = prefs[user]
    scores = {}
    totalSim = {}
    # Loop over items rated by this user
    for (item, rating) in userRatings.items():
        # Loop over items similar to this one
        for (similarity, item2) in itemMatch[item]:
            # Ignore if this user has already rated this item
            if item2 in userRatings:
                continue
            # Weighted sum of rating times similarity
            scores.setdefault(item2, 0)
            scores[item2] += similarity * rating
            # Sum of all the similarities
            totalSim.setdefault(item2, 0)
            totalSim[item2] += similarity
    # Divide each total score by total weighting to get an average
    rankings = [[score / totalSim[item], item] for (item, score) in
                scores.items()]
    # Return the rankings from highest to lowest
    rankings.sort(key= lambda x: (x[0], int(x[1][-5:-1])))
    rankings.reverse()
    rankings = ['|'+item+'|' for (score, item) in rankings]
    return rankings

def main():
    # lines = read_in()

    # load object
    prefs_small_load = pickle.load(open('recom/prefs_small_rfc.pkl', "rb"))
    itemsim_small_load = pickle.load(open('recom/itemsim_small_rfc.pkl', "rb"))
    data = getRecommendedItems(prefs_small_load, itemsim_small_load, int(sys.argv[1]))[0:10]
    # data = [[1],['1']]
    print(data)
    sys.stdout.flush()
    # return data
# [[ , title, ],
#  [],
#  ...]


#start process
if __name__ == '__main__':
    main()

from flask import Flask,render_template
from flask import request
import pandas as pd
from sklearn import preprocessing
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import json
from flask import jsonify
from scipy import stats
from sklearn.manifold import MDS

variance_original = pd.DataFrame()
variance_random = pd.DataFrame()
variance_stratified = pd.DataFrame()
attributeloadingdf = pd.DataFrame()
numericaldatadf = None
randomsamplingdf = None
Clustervalues = None
mdsstratcorrelationdf = None
mdsstrateuclideandf = None
mdsrandeuclideandf = None 
mdsrandcorrelationdf = None
mdsorigcorrelationdf = None
mdsorigeuclideandf = None

#Import flask module
app = Flask(__name__)
#Make route handle both post and get methods
@app.route('/kmeans')
def plot():
    return render_template('kmeansplot.html', url='/static/images/kmeansplot.png')

@app.route("/", methods = ['POST', 'GET'])
def index():
    if request.method == 'POST':
        if request.form['request'] == 'randomsampling':
            data = variance_random
            #print("Data random:",variance_random)
            randompcadatajson = json.dumps(data.to_dict(orient='records'), indent=2)
            data = {'pcadata': randompcadatajson}
            return jsonify(data)
        elif request.form['request'] == 'originaldata':
            data = variance_original
            #print("Data original:",variance_original)
            originalpcadatajson = json.dumps(data.to_dict(orient='records'), indent=2)
            data = {'pcadata': originalpcadatajson}
            return jsonify(data)
        elif request.form['request'] == 'stratifiedsampling':
            data = variance_stratified
            #print("Data stratified:",variance_stratified)
            stratifiedpcadatajson = json.dumps(data.to_dict(orient='records'), indent=2)
            data = {'pcadata': stratifiedpcadatajson}
            return jsonify(data)
        elif request.form['request'] == 'pcatwovectororiginal':
        	pca = PCA(n_components=2)
        	components = pca.fit_transform(numericaldatadf)
        	pcadf = pd.DataFrame(data=components,columns=['Component1','Component2'])
        	#print(numericaldatadf.describe())
        	data = json.dumps(pcadf.to_dict(orient='records'), indent=2)
        	data = {'pcatwovectordata': data}
        	return jsonify(data)
        elif request.form['request'] == 'pcatwovectorrandom':
        	pca = PCA(n_components=2)
        	components = pca.fit_transform(randomsamplingdf)
        	pcadf = pd.DataFrame(data=components,columns=['Component1','Component2'])
        	#print(randomsamplingdf.describe())
        	data = json.dumps(pcadf.to_dict(orient='records'), indent=2)
        	data = {'pcatwovectordata': data}
        	return jsonify(data)
        elif request.form['request'] == 'pcatwovectorstratified':
        	pca = PCA(n_components=2)
        	components = pca.fit_transform(stratifiedsampledf)
        	pcadf = pd.DataFrame(data=components,columns=['Component1','Component2'])
        	#print(stratifiedsampledf.describe())
        	pcadf['Cluster'] = Clustervalues
        	data = json.dumps(pcadf.to_dict(orient='records'), indent=2)
        	data = {'pcatwovectordata': data}
        	return jsonify(data)
        elif request.form['request'] == 'scattermatrixorig':
        	scattermatrixdf = numericaldatadf.copy()
        	columndf = scattermatrixdf[['BsmtUnfSF','GrLivArea','2ndFlrSF']] #top 3 pca attributes
        	data = json.dumps(columndf.to_dict(orient='records'), indent=2)
        	data = {'scattermatrixdata': data}
        	return jsonify(data)
        elif request.form['request'] == 'scattermatrixstrat':
        	scattermatrixdf = stratifiedsampledf.copy()
        	scattermatrixdf['Cluster'] = Clustervalues
        	columndf = scattermatrixdf[['BsmtUnfSF','GrLivArea','2ndFlrSF','Cluster']] #top 3 pca attributes
        	data = json.dumps(columndf.to_dict(orient='records'), indent=2)
        	data = {'scattermatrixdata': data}
        	return jsonify(data)
        elif request.form['request'] == 'scattermatrixrandom':
        	scattermatrixdf = randomsamplingdf.copy()
        	columndf = scattermatrixdf[['BsmtUnfSF','GrLivArea','2ndFlrSF']] #top 3 pca attributes
        	data = json.dumps(columndf.to_dict(orient='records'), indent=2)
        	data = {'scattermatrixdata': data}
        	return jsonify(data)
        elif request.form['request'] == 'mdsstratifiedco':
            data = mdsstratcorrelationdf
            data = json.dumps(data.to_dict(orient='records'), indent=2)
            data = {'mdsscatterdata': data}
            return jsonify(data)
        elif request.form['request'] == 'mdsstratifiedeu':
            data = mdsstrateuclideandf
            data = json.dumps(data.to_dict(orient='records'), indent=2)
            data = {'mdsscatterdata': data}
            return jsonify(data)
        elif request.form['request'] == 'mdsrandomeu':
            data = mdsrandeuclideandf
            data = json.dumps(data.to_dict(orient='records'), indent=2)
            data = {'mdsscatterdata': data}
            return jsonify(data)
        elif request.form['request'] == 'mdsrandomco':
            data = mdsrandcorrelationdf
            data = json.dumps(data.to_dict(orient='records'), indent=2)
            data = {'mdsscatterdata': data}
            return jsonify(data)
        elif request.form['request'] == 'mdsorigeu':
            data = mdsorigeuclideandf
            data = json.dumps(data.to_dict(orient='records'), indent=2)
            data = {'mdsscatterdata': data}
            return jsonify(data)
        elif request.form['request'] == 'mdsorigco':
            data = mdsorigcorrelationdf
            data = json.dumps(data.to_dict(orient='records'), indent=2)
            data = {'mdsscatterdata': data}
            return jsonify(data)
    else:
    	data = variance_original
    	#print("Data original:",variance_original)
    	originalpcadatajson = json.dumps(data.to_dict(orient='records'), indent=2)
    	data = {'pcadata': originalpcadatajson}
    	return render_template("index.html", data=data)

if __name__ == "__main__":
    datadf = pd.read_csv('Data.csv')
    #Remove unnecessary categorical variables
    numericaldatadf = datadf.drop(['Id'], axis=1)

	#one hot encoding categorical variables
    one_hot = pd.get_dummies(numericaldatadf['MSZoning'])	
    numericaldatadf = numericaldatadf.drop('MSZoning',axis = 1)
    numericaldatadf = numericaldatadf.join(one_hot)
    one_hot = pd.get_dummies(numericaldatadf['LotConfig'])
    numericaldatadf = numericaldatadf.drop('LotConfig',axis = 1)
    numericaldatadf = numericaldatadf.join(one_hot)
    one_hot = pd.get_dummies(numericaldatadf['SaleType'])
    numericaldatadf = numericaldatadf.drop('SaleType',axis = 1)
    numericaldatadf = numericaldatadf.join(one_hot)

    numericaldatadf= numericaldatadf[(np.abs(stats.zscore(numericaldatadf)) < 3).all(axis=1)]
    
    #drop na values
    numericaldatadf.dropna(inplace=True)
    numericaldatadf= numericaldatadf.reset_index(drop=True)
    #print(numericaldatadf["SalePrice"].head(20))
    print(numericaldatadf.describe())

    #Random sampling
    randomsamplingdf = numericaldatadf.sample(frac=0.25)

    print(randomsamplingdf.describe())

    cols = numericaldatadf.columns
    min_max_scaler = preprocessing.MinMaxScaler()
    np_scaled = min_max_scaler.fit_transform(numericaldatadf)
    scalednumericaldatadf = pd.DataFrame(np_scaled, columns = cols)

    distortions = []
    K = range(1,10)
    for k in K:
    	kmeanModel = KMeans(n_clusters=k)
    	kmeanModel.fit(scalednumericaldatadf)
    	distortions.append(kmeanModel.inertia_)

    plt.figure(figsize=(16,8))
    plt.plot(K, distortions, 'bo-')
    plt.xlabel('k')
    plt.ylabel('Distortion')
    plt.title('The Elbow Method showing the optimal k')
    #plt.show()
    plt.savefig('static/images/kmeansplot.png') #k means plot

    #we get the optimal value of k as 4
    kmeans=KMeans(n_clusters=4, max_iter=500)
    kmeans.fit(scalednumericaldatadf)

    percentsample = 0.25
    numberofclusters = 4
    stratifiedsampledf = pd.DataFrame()
    for i in range(0,numberofclusters):
    	clusterelements = np.where(kmeans.labels_ == i)[0].tolist()
    	totalclusteritems = len(clusterelements)
    	numrows = int(percentsample*totalclusteritems)
    	sampleindex = np.random.choice(clusterelements, numrows)
    	clusterdf = scalednumericaldatadf.loc[sampleindex]
    	clusterdf["Cluster"] = "Cluster "+str(i)
    	stratifiedsampledf = pd.concat([stratifiedsampledf,clusterdf],axis = 0)
    
    Clustervalues = stratifiedsampledf.loc[:,['Cluster']].values
    stratifiedsampledf = stratifiedsampledf.drop('Cluster', 1)

    print(stratifiedsampledf.describe())
    #print(stratifiedsampledf.head(20))
    #print(stratifiedsampledfwithcluster.head(20))

    #PCA
    print("Working on PCA for original data...")
    pcaoriginal = PCA()
    originaltransform = StandardScaler().fit_transform(numericaldatadf)
    pcaoriginal.fit(originaltransform)
    variance_original['variance'] = pcaoriginal.explained_variance_ #variance for given value of components
    print("Finished Original PCA")

    print("Working on PCA for Random sampled data...")
    pcarandom = PCA()
    randomtransform = StandardScaler().fit_transform(randomsamplingdf)
    pcarandom.fit(randomtransform)
    variance_random['variance'] = pcarandom.explained_variance_ #variance for given value of components
    print("Finished Random PCA")

    print("Working on PCA for stratified sampled data...")
    pcastratified = PCA()
    stratifiedtransform = StandardScaler().fit_transform(stratifiedsampledf)
    pcastratified.fit(stratifiedtransform)
    variance_stratified['variance'] = pcastratified.explained_variance_ #variance for given value of components
    print("Finished Stratified PCA")

    #attributes with highest pca loadings
    columndf=pd.DataFrame()
    newpca = PCA(n_components=8) #8 intrinsic dimensions from scree plot
    components = newpca.fit_transform(originaltransform)
    rootvar = np.sqrt(newpca.explained_variance_) #variance
    loadingvaluedf= rootvar*newpca.components_.T #loading values
    columndf['ColumnNames']=numericaldatadf.columns.values #df with all column names
    rankingvaluedf=pd.DataFrame(data=loadingvaluedf,columns=['Component1','Component2','Component3','Component4','Component5','Component6','Component7','Component8']) #loading values for each component
    valuedf = rankingvaluedf
    rankingvaluedf=pd.concat([columndf,rankingvaluedf],sort=True,axis=1) 
    rankingvaluedf['SquaredLoadingSummation']=valuedf.apply(lambda x:np.sqrt(np.square(x['Component1'])+np.square(x['Component2'])+np.square(x['Component3'])+np.square(x['Component4'])+np.square(x['Component5'])+np.square(x['Component6'])+np.square(x['Component7'])+np.square(x['Component8'])),axis=1)
    rankingvaluedf = rankingvaluedf.sort_values(by=['SquaredLoadingSummation'],ascending=False) #sorted wrt sum of squared loading
    attributeloadingdf = rankingvaluedf
    print(attributeloadingdf.head(10))

    #MDS
    print("Working on MDS for Stratified sampled data...")
    euclideanmds = MDS(n_components=2, dissimilarity='euclidean')
    euclideanmds = euclideanmds.fit_transform(stratifiedtransform)
    euclideanmdsdf = pd.DataFrame(euclideanmds)
    mdsstrateuclideandf = pd.DataFrame()
    mdsstrateuclideandf['x'] = euclideanmdsdf[0]
    mdsstrateuclideandf['Cluster'] = Clustervalues
    mdsstrateuclideandf['y'] = euclideanmdsdf[1]


    correlationmds = MDS(n_components=2, dissimilarity='precomputed')
    stratifiedtransformdf = pd.DataFrame(stratifiedtransform)
    stratifiedtransformdf = stratifiedtransformdf.transpose() #transpose
    correlationmatrix = stratifiedtransformdf.corr() #corr matrix
    for column in correlationmatrix.columns:
        correlationmatrix[column].values[:] = 1 - correlationmatrix[column].values[:] #inverse  
    mdsstratcorrelationdf = pd.DataFrame(correlationmds.fit_transform(correlationmatrix))
    mdsstratcorrelationdf['x'] = mdsstratcorrelationdf[0]
    mdsstratcorrelationdf['Cluster'] = Clustervalues
    mdsstratcorrelationdf['y'] = mdsstratcorrelationdf[1]
    print("Finished Stratified MDS")

    print("Working on MDS for Random sampled data...")
    euclideanmds = MDS(n_components=2, dissimilarity='euclidean')
    euclideanmds = euclideanmds.fit_transform(randomtransform)
    euclideanmdsdf = pd.DataFrame(euclideanmds)
    mdsrandeuclideandf = pd.DataFrame()
    mdsrandeuclideandf['x'] = euclideanmdsdf[0]
    mdsrandeuclideandf['y'] = euclideanmdsdf[1]

    correlationmds = MDS(n_components=2, dissimilarity='precomputed')
    randtransformdf = pd.DataFrame(randomtransform)
    randtransformdf = randtransformdf.transpose() #transpose
    correlationmatrix = randtransformdf.corr() #corr matrix
    for column in correlationmatrix.columns:
        correlationmatrix[column].values[:] = 1 - correlationmatrix[column].values[:] #inverse
    mdsrandcorrelationdf = pd.DataFrame(correlationmds.fit_transform(correlationmatrix))
    mdsrandcorrelationdf['x'] = mdsrandcorrelationdf[0]
    mdsrandcorrelationdf['y'] = mdsrandcorrelationdf[1]
    print("Finished Random MDS")

    print("Working on MDS for Original data, this might take ~3 minutes due to huge volume...")
    euclideanmds = MDS(n_components=2, dissimilarity='euclidean')
    euclideanmds = euclideanmds.fit_transform(originaltransform)
    euclideanmdsdf = pd.DataFrame(euclideanmds)
    mdsorigeuclideandf = pd.DataFrame()
    mdsorigeuclideandf['x'] = euclideanmdsdf[0]
    mdsorigeuclideandf['y'] = euclideanmdsdf[1]
    
    correlationmds = MDS(n_components=2, dissimilarity='precomputed')
    origtransformdf = pd.DataFrame(originaltransform)
    origtransformdf = origtransformdf.transpose() #transpose
    correlationmatrix = origtransformdf.corr() #corr matrix
    for column in correlationmatrix.columns:
        correlationmatrix[column].values[:] = 1 - correlationmatrix[column].values[:] #inverse
    mdsorigcorrelationdf = pd.DataFrame(correlationmds.fit_transform(correlationmatrix))
    mdsorigcorrelationdf['x'] = mdsorigcorrelationdf[0]
    mdsorigcorrelationdf['y'] = mdsorigcorrelationdf[1]
    print("Finished MDS for original data")

    app.run()

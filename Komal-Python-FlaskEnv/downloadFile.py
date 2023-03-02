from azure.storage.blob import BlobServiceClient

storage_account_key = "lg+SkFUDBH/r4LBKEY4Qs83QwkeAinrrpMoOhT9CTWLXzdAJ5Z6C/kncBr6i2fQ6p4EsqhDQOkNM+AStHTAcrg=="
storage_account_name = "testkk"
connection_string = "DefaultEndpointsProtocol=https;AccountName=testkk;AccountKey=zRajHglS/ubEApK7QMysa+kfr43ossjbiG043fVvZywR4j1QNl9dS6ueBCN+9cuI7ZifRQwJejaB+AStCAjSEw==;EndpointSuffix=core.windows.net"
container_name = "fileholder"

def downloadToBlobStorage(file_path, file_name):
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    blob_client = BlobServiceClient.get_blob_client(blob_service_client,container=container_name, blob=file_name)

    with open(file_path, "wb") as my_blob:
        download_stream = blob_client.download_blob()
        my_blob.write(download_stream.readall())
 
downloadToBlobStorage('D:\\Bill.pdf','Bill1')
  
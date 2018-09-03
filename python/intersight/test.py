import intersight.rest as isREST
import json

# Testing
private_key_file = open("./keys/private_key.pem", "r") 
isREST.set_private_key(private_key_file.read())

public_key_file = open("./keys/public_key.txt", "r") 
isREST.set_public_key(public_key_file.read())

resourcePath = '/ntp/Policies'

# patchMoid = None

# POST TEST
# --------------------------------------------------------------
# postBody = {
#     "Name": "Test-NTP",
#     "Description": "Test NTP Policy",
#     "NtpServers": ["8.8.8.8"]
# }

# options = {
#     "resource_path": resourcePath,
#     "body": postBody
# }

# print("POST:")
# results = isREST.intersight_call(resource_path=resourcePath, body=postBody)
# print(json.dumps(results, indent=4))
# --------------------------------------------------------------

# Empty queryParams #
queryParams = {}

# Example queryParams returning the top 1 result(s) #
# queryParams = {
#     "$top": 1
# }

# Example queryParams showing filter by "Name" key #
# queryParams = {
#     "$filter": "Name eq 'Test-NTP'"
# }

# Example queryParams showing filter by "Description" key #
# queryParams = {
#     "$filter": "Description eq 'time.cisco.com'"
# }

# Example queryParams showing advanced Tag filder by key & value #
# queryParams = {
#     "$filter": "Tags/any(t: t/Key eq 'loc' and t/Value eq 'Irvine')"
# }

# GET TEST
# --------------------------------------------------------------
# options = {
#     "resource_path": resourcePath,
#     "query_params": queryParams
# }

# options = {
#     "resource_path": resourcePath
# }

print("GET:")
results = isREST.intersight_call(resource_path=resourcePath, query_params=queryParams)
print(json.dumps(results, indent=4))
# --------------------------------------------------------------

# patchMoid = "5b8ccb247462713678dda757"

# PATCH TEST
# --------------------------------------------------------------
# patchBody = {
#     "NtpServers": ["10.10.10.10"]
# }

# options = {
#     "resource_path": resourcePath,
#     "body": patchBody,
#     "moid": patchMoid
# }

# print("PATCH: ")
# results = isREST.intersight_call(resource_path=resourcePath, body=patchBody, moid=patchMoid)
# print(json.dumps(results, indent=4))
# --------------------------------------------------------------

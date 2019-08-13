import sys, getopt, json

def main(argv):
   try:
     context=json.loads(argv[1])
     data={
        "body" : "Hello from python"
     };
     print(json.dumps(data))
   except:
     print('{}')

main(sys.argv)

import re
import csv
import datetime
from itertools import combinations

# Declare Constants
delimiterCharacters = [':','|']
entityLabels = ['URL','Login','Password']
sampleLinesToCheck = 1000

# debug mode biar nggak seluruh file parse ambil bbrp line aja
debugMode = False
debugLinesReadCount = 100

# Helper Functions
def get_delimiter_per_line(line):
  delimiter_counts = {delimiter: line.count(delimiter) for delimiter in delimiterCharacters}
  return max(delimiter_counts, key=delimiter_counts.get)

def get_largest_key(dict):
  max_val = max(dict.values())
  max_keys = []
  for key in dict:
    if dict[key] == max_val:
      max_keys.append(key)
  return max_keys

def clean_string_http(string):
  if('https://' in string):
    string = string.replace('https://','https//')
  if('http://' in string):
    string = string.replace('http://','http//')
  return string

def fix_string_http(string):
  if('https//' in string):
    string = string.replace('https//','https://')
  if('http//' in string):
    string = string.replace('http//','http://')
  return string

def check_entity_type(string):
  if(string.startswith('http')):
    return 'URL'
  if(re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', string)):
    return 'Login'
  return 'Password'

def check_line_pattern(segments,delimiter):
  pattern = []
  for segment in segments:
    entity = check_entity_type(segment)
    if entity in pattern and entity == 'Password':
      pattern[pattern.index(entity)] = 'Login'
    pattern.append(entity)
  return delimiter.join(pattern)

def split_string_with_exceptions(input_string, char, exceptions):
    positions = [i for i, c in enumerate(input_string) if c == char]
    combinations_to_exclude = combinations(positions, exceptions)

    results = []
    for exclude in combinations_to_exclude:
        split_result = []
        last_index = 0
        for i, c in enumerate(input_string):
            if i in positions and i not in exclude:
                split_result.append(input_string[last_index:i])
                last_index = i + 1
        split_result.append(input_string[last_index:])
        results.append(split_result)
    return results

# Service Functions
def get_delimiter(filepath):
  delimiterCount = {}
  delimiterMaxCount = {}
  for delimiter in delimiterCharacters:
    delimiterCount[delimiter] = 0
    delimiterMaxCount[delimiter] = 0

  # Get Samples
  file1 = open(filepath, 'r', encoding="utf8")
  sample = []
  linesChecked = 0
  for _ in range(sampleLinesToCheck):
    # Read line & clean up for validation
    line = file1.readline().strip()
    if not line or 'https://t.me/' in line:
      continue
    linesChecked += 1
    checkline = clean_string_http(line)
    
    # Check if line contains delimiter
    hasDelimiter = False
    for delimiter in delimiterCharacters:
      if delimiter in checkline:
        hasDelimiter = True
        delimiterCount[delimiter] += checkline.count(delimiter)
    
    if hasDelimiter:
      maxdelimiter = get_delimiter_per_line(checkline)
      delimiterMaxCount[maxdelimiter] += 1
      sample.append(line)
  
  mostUsedDelimiter = get_largest_key(delimiterMaxCount)[0]
  sampleCount = len(sample)
  if(sampleCount == 0):
    print('No delimiter is found in file')
    return None
  delimiterOccurences = delimiterCount[mostUsedDelimiter]
  averageOccurences = (int)(round((delimiterOccurences/linesChecked),0))
  if(averageOccurences == 0):
    print('No delimiter is found in file')
    return None
  
  # print(f'Read {sampleLinesToCheck} lines from file {filepath}')
  # print(f'{sampleCount} lines found with delimiter from {linesChecked} lines checked')
  # print(f'Most used delimiter: \'{mostUsedDelimiter}\' ({delimiterMaxCount[mostUsedDelimiter]} lines)\tdata:{delimiterMaxCount}')
  # print(f'Total occurences of delimiter: {delimiterOccurences}\tdata:{delimiterCount}')
  # print(f'Average use of delimiter per line: {delimiterOccurences/linesChecked}')
  return (mostUsedDelimiter,averageOccurences)

def get_pattern(filepath,delimiterDetail):
  delimiter = delimiterDetail[0]
  delimiterCount = delimiterDetail[1]
  patternCount = {}

  file1 = open(filepath, 'r', encoding="utf8")
  for _ in range(sampleLinesToCheck):
    # Read line & clean up for validation
    line = file1.readline().strip()
    if (not line or 'https://t.me/' in line):
      continue
    checkline = clean_string_http(line)
    if checkline.count(delimiter) != delimiterCount:
      continue
    segments = checkline.split(delimiter)
    patternstring = check_line_pattern(segments,delimiter)

    if patternstring not in patternCount:
      patternCount[patternstring] = 0
    patternCount[patternstring] += 1
  return max(patternCount, key=lambda k: patternCount.get(k)).split(delimiter)

def parse_data(filepath,delimiterDetail,pattern):
  delimiter = delimiterDetail[0]
  delimiterCount = delimiterDetail[1]

  debugTesting = 0

  dataList = []
  file1 = open(filepath, 'r', encoding="utf8")
  for line in file1:
    if (not line.strip() or 'https://t.me/' in line):
      continue
    cleanedLine = clean_string_http(line.strip())
    delimiterCheckCount = cleanedLine.count(delimiter)
    if delimiterCheckCount == delimiterCount:
      segments = cleanedLine.split(delimiter)
      data = {}
      for segment,entity in zip(segments,pattern):
        if entity == 'URL':
          segment = fix_string_http(segment)
        data[entity] = segment
      dataList.append(data)
    elif delimiterCheckCount > delimiterCount:
      tempDataList = []
      splits = split_string_with_exceptions(cleanedLine, delimiter, delimiterCheckCount-delimiterCount)
      hasEmail = False
      for segments in splits:
        valid = True
        data = {}
        for segment,entity in zip(segments,pattern):
          # Validation here
          if entity == 'URL':
            segment = fix_string_http(segment)
          if entity == 'Login' and re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', segment):
            hasEmail = True
          # -------------------
          data[entity] = segment
        if valid:
          tempDataList.append(data)
        if hasEmail:
          tempDataList = [data]
          break
      dataList += tempDataList
    if debugTesting == debugLinesReadCount and debugMode:
      break
    debugTesting += 1
  return dataList

def fileParser(fileToCheck):
  starttime = datetime.datetime.now()
  print('start:',starttime)

  delimiter = get_delimiter(fileToCheck)
  if not delimiter: return
  pattern = get_pattern(fileToCheck,delimiter)
  data = parse_data(fileToCheck,delimiter,pattern)

#   keys = data[0].keys()
#   with open('parsedData.csv', 'w', newline='', encoding='utf-8') as output_file:
#     dict_writer = csv.DictWriter(output_file, keys)
#     dict_writer.writeheader()
#     dict_writer.writerows(data)
  
  endtime = datetime.datetime.now()
  print('end:',endtime)
  print('time processed: ',endtime-starttime)
  print('rows parsed',len(data))
  print('delimiter:',delimiter)
  print('pattern:',delimiter[0].join(pattern))
  return data
import json


class DatasetDescriptor(object):
    def __init__(self):
        self.data = {'NUMBER_OF_RECORDS': 0,
                     'BASISOFRECORDS': {},
                     'TAXON_MATCHES': {}}

    def increment_number_records(self):
        self.data['NUMBER_OF_RECORDS'] = self.data['NUMBER_OF_RECORDS'] + 1

    def _store_or_increment_counter(self, value, dict_name):
        if value in self.data[dict_name]:
            self.data[dict_name][value] = self.data[dict_name][value] + 1
        else:
            self.data[dict_name][value] = 1

    def store_or_increment_bor(self, value):
        self._store_or_increment_counter(value, 'BASISOFRECORDS')

    def store_or_increment_taxonmatch(self, value):
        self._store_or_increment_counter(value, 'TAXON_MATCHES')


class DatasetDescriptorAwareEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, DatasetDescriptor):
            return obj.data

        return json.JSONEncoder.default(self, obj)

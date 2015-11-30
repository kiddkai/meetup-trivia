
exports.create = function(data, cb) {
  cb(null, {
    id: 'bd9ac52e'
  });
};

exports.get = function(id, cb) {
  cb(null, {
    name: 'Bob',
    score: 12
  });
};

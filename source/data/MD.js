
lychee.define('app.data.MD').exports(function(lychee, global, attachments) {

	/*
	 * HELPERS
	 */

	const _Stream = function(buffer, mode) {

		this.__buffer = typeof buffer === 'string'        ? buffer : '';
		this.__mode   = lychee.enumof(_Stream.MODE, mode) ? mode   : 0;

		this.__index  = 0;

	};

	_Stream.MODE = {
		read:  0,
		write: 1
	};

	_Stream.prototype = {

		toString: function() {
			return this.__buffer;
		},

		pointer: function() {
			return this.__index;
		},

		length: function() {
			return this.__buffer.length;
		},

		read: function(bytes) {

			let buffer = '';

			buffer       += this.__buffer.substr(this.__index, bytes);
			this.__index += bytes;

			return buffer;

		},

		search: function(array) {

			let bytes = Infinity;

			for (let a = 0, al = array.length; a < al; a++) {

				let token = array[a];
				let size  = this.__buffer.indexOf(token, this.__index + 1) - this.__index;
				if (size > -1 && size < bytes) {
					bytes = size;
				}

			}


			if (bytes === Infinity) {
				return -1;
			}


			return bytes;

		},

		seek: function(bytes) {
			return this.__buffer.substr(this.__index, bytes);
		},

		write: function(buffer) {

			this.__buffer += buffer;
			this.__index  += buffer.length;

		}

	};



	/*
	 * ENCODER and DECODER
	 */

	const _encode_inline = function(entities) {

		let text = '';


		entities.forEach(function(entity) {

			if (entity.token === 'Code') {

				text += ' `' + entity.value + '`';

			} else if (entity.token === 'Text') {

				if (entity.value.match(/\.|\,|\?|\!/g)) {

					text += entity.value;

				} else {

					if (entity.type === 'bold') {
						text += ' **' + entity.value + '**';
					} else if (entity.type === 'italic') {
						text += ' *'  + entity.value + '*';
					} else {
						text += ' ' + entity.value;
					}

				}

			} else if (entity.token === 'Image') {

				text += ' ![' + entity.type + '](' + entity.value + ')';

			} else if (entity.token === 'Link') {

				text += ' [' + entity.type + '](' + entity.value + ')';

			}

		});


		return text.trim();

	};

	const _encode = function(stream, data) {

		for (let d = 0, dl = data.length; d < dl; d++) {

			let entity = data[d];

			if (entity.token === 'Article') {

				stream.write('\n');
				stream.write('=');
				stream.write(' ');
				stream.write(entity.value);
				stream.write('\n\n');

			} else if (entity.token === 'Headline') {

				let type = '################'.substr(0, entity.type);

				stream.write(type);
				stream.write(' ');
				stream.write(entity.value);
				stream.write('\n\n');

			} else if (entity.token === 'Code') {

				stream.write('```');
				stream.write(entity.type || '');
				stream.write('\n');
				stream.write(entity.value);
				stream.write('\n');
				stream.write('```');
				stream.write('\n\n');

			} else if (entity.token === 'List') {

				stream.write(entity.value.map(function(val) {
					return '- ' + _encode_inline(val);
				}).join('\n'));
				stream.write('\n\n');

			} else if (entity.token === 'Paragraph') {

				stream.write(_encode_inline(entity.value));
				stream.write('\n\n');

			}

		}


	};

	const _decode_inline = function(text) {

		let entities    = [];
		let last_entity = null;


		text.match(/(\[[^\)]+\)|[^\s]+)/gi).forEach(function(str) {

			let entity = null;
			let suffix = null;
			let value  = '';


			if (str.substr(-1).match(/\.|\,|\?|\!/g)) {
				suffix = str.substr(-1);
				str    = str.substr(0, str.length - 1);
			}


			let b_code   = str.substr(0, 1) === '`';
			let e_code   = str.substr(-1) === '`';
			let b_bold   = str.substr(0, 2) === '**';
			let e_bold   = str.substr(-2) === '**';
			let b_italic = str.substr(0, 1) === '*';
			let e_italic = str.substr(-1) === '*';

			let i0, i1, i2, i3;


			if (b_code || e_code) {

				if (b_code && e_code) {
					value = str.substr(1, str.length - 2);
				} else if (b_code) {
					value = str.substr(1);
				} else if (e_code) {
					value = str.substr(0, str.length - 1);
				}


				entity = {
					token: 'Code',
					type:  'javascript',
					value: value
				};


			} else if (b_bold || e_bold) {

				if (b_bold && e_bold) {
					value = str.substr(2, str.length - 4);
				} else if (b_bold) {
					value = str.substr(2);
				} else if (e_bold) {
					value = str.substr(0, str.length - 2);
				}


				entity = {
					token: 'Text',
					type:  'bold',
					value: value
				};


			} else if (b_italic || e_italic) {

				if (b_italic && e_italic) {
					value = str.substr(1, str.length - 2);
				} else if (b_italic) {
					value = str.substr(1);
				} else if (e_italic) {
					value = str.substr(0, str.length - 1);
				}


				entity = {
					token: 'Text',
					type:  'italic',
					value: str.substr(1, str.length - 2)
				};

			} else if (str.substr(0, 1) === '!') {

				i0 = str.indexOf('[');
				i1 = str.indexOf(']');
				i2 = str.indexOf('(');
				i3 = str.indexOf(')');

				entity = {
					token: 'Image',
					type:  str.substr(i0 + 1, i1 - i0 - 1),
					value: str.substr(i2 + 1, i3 - i2 - 1)
				};

			} else if (str.substr(0, 1) === '[') {

				i0 = str.indexOf('[');
				i1 = str.indexOf(']');
				i2 = str.indexOf('(');
				i3 = str.indexOf(')');

				entity = {
					token: 'Link',
					type:  str.substr(i0 + 1, i1 - i0 - 1),
					value: str.substr(i2 + 1, i3 - i2 - 1)
				};

			} else {

				entity = {
					token: 'Text',
					type:  'normal',
					value: str
				};

			}


			if (last_entity !== null) {

				if (last_entity.token === entity.token && last_entity.type === entity.type) {

					last_entity.value += ' ' + entity.value;

				} else {

					entities.push(entity);
					last_entity = entity;

				}


				if (suffix !== null) {

					if (last_entity.token === 'Text' && last_entity.type === 'normal') {

						last_entity.value += suffix;

					} else {

						entity = {
							token: 'Text',
							type:  'normal',
							value: suffix
						};

						entities.push(entity);
						last_entity = entity;

					}

				}

			} else {

				entities.push(entity);
				last_entity = entity;

			}

		});


		return entities;

	};

	const _decode = function(stream) {

		let value  = undefined;
		let seek   = '';
		let size   = 0;
		let tmp    = 0;
		let errors = 0;
		let check  = null;


		if (stream.pointer() === 0) {

			seek = stream.seek(1);

			if (seek === '\n') {

				stream.read(1);


				value  = [];
				errors = 0;

				while (errors === 0 && stream.pointer() < stream.length()) {

					tmp = _decode(stream);

					if (tmp instanceof Object) {
						value.push(tmp);
					} else if (tmp === undefined) {
						errors++;
					}

				}

			}

		} else if (stream.pointer() < stream.length()) {

			seek = stream.seek(1);


			if (seek === '=') {

				stream.read(1);

				size = stream.search([ '\n' ]);

				if (size !== -1) {

					tmp   = stream.read(size).trim();
					value = {
						token: 'Article',
						type:  null,
						value: tmp
					};

					stream.read(1);

				}


			} else if (seek === '#') {

				size = stream.search([ '\n' ]);

				if (size !== -1) {

					tmp   = stream.read(size).trim();
					value = {
						token: 'Headline',
						type:  tmp.split(' ')[0].length,
						value: tmp.split(' ').slice(1).join(' ')
					};

					stream.read(1);

				}


			} else if (seek === '`') {

				size = stream.search([ '\n' ]);
				tmp  = stream.read(size);

				if (size !== -1 && tmp.substr(0, 3) === '```') {

					check = stream.search([ '```' ]);

					if (check !== -1) {

						value = {
							token: 'Code',
							type:  tmp.substr(3).trim(),
							value: stream.read(check).trim()
						};

						stream.read(3);

					}

				}


			} else if (seek === '-') {

				size = stream.search([ '\n\n' ]);

				if (size !== -1) {

					tmp   = stream.read(size).trim();
					value = {
						token: 'List',
						type:  null,
						value: tmp.split('\n').map(function(val) {

							if (val.substr(0, 1) === '-') {
								val = val.substr(1);
							}

							return _decode_inline(val.trim());

						})
					};

					stream.read(1);

				}

			} else if (seek.match(/[A-Za-z0-9\[\!*]/)) {

				size = stream.search([ '\n\n' ]);

				if (size !== -1) {

					tmp   = stream.read(size).trim();
					value = {
						token: 'Paragraph',
						type:  null,
						value: _decode_inline(tmp)
					};

					stream.read(1);

				}


			} else if (seek === '\n') {

				stream.read(1);
				value = null;


			} else {

				size = stream.search([ '\n' ]);

				if (size !== -1) {
					stream.read(size);
				}

				stream.read(1);
				value = null;

			}

		}


		return value;

	};



	/*
	 * IMPLEMENTATION
	 */

	const Module = {

		// deserialize: function(blob) {},

		serialize: function() {

			return {
				'reference': 'app.data.MD',
				'blob':      null
			};

		},

		encode: function(data) {

			data = data instanceof Object ? data : null;


			if (data !== null) {

				let stream = new _Stream('', _Stream.MODE.write);

				_encode(stream, data);

				return stream.toString();

			}


			return null;

		},

		decode: function(data) {

			data = typeof data === 'string' ? data : null;


			if (data !== null) {

				let stream = new _Stream(data, _Stream.MODE.read);
				let object = _decode(stream);
				if (object !== undefined) {
					return object;
				}

			}


			return null;

		}

	};


	return Module;

});


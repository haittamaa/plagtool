exports = module.exports = plagtool;

function plagtool(_login, _password, _api_domain){
	var plagtool = this;
	var config = require('./config.json');
	var request = require('request');
	var querystring = require('querystring');
	var _allowed_extensions = ['doc', 'csv', 'html', 'ods', 'odt', 'pdf', 'ppt', 'rtf', 'txt', 'xls', 'docx', 'xlsx'];
	if(_api_domain == null) _api_domain = 'server.plagtracker.com';
	var _response = null;
	
	/**
     *  Method runs methods in batch
    */
	this.batch = function(methods, callback){
			var url = "https://"+_api_domain+"/rest/v2.batch";  
			var post_data = querystring.stringify({methods:methods});
			this._execHttpRequest(url, post_data, function(error, result){
				callback(error, result); // call batch callback
			});
	 };
	
	/**
    * Add text for checking
    * 
    * @param string text
    * @param object|null custom_text_settings
    * @return object 
    */
	this.addTextForChecking = function(text, custom_text_settings, callback){
			if(typeof(custom_text_settings) == "function"){
				callback = custom_text_settings;
				custom_text_settings = {ignore_quotation:false, search_on_site:null, internal_check:false};
			}
			var url = "https://"+_api_domain+"/rest/v2.add-text-for-checking";  
			var post_data = 'text='+text;
			// var post_data = 'text='+encodeURIComponent(text);
			plagtool._addTextSettingsToPost(post_data, custom_text_settings, function(post_data){
				plagtool._execHttpRequest(url, post_data, function(error, result){
					callback(error, result); // call batch callback
				});
			});
			
	 };
	 
	 /**
     * Add url for checking
     * 
     * @param string url_for_checking
     * @param object|null custom_text_settings
     * @return object 
     */
	 this.addUrlForChecking = function(url_for_checking, custom_text_settings, callback){
			if(typeof(custom_text_settings) == "function"){
				callback = custom_text_settings;
				custom_text_settings = {ignore_quotation:false, search_on_site:null, internal_check:false};
			}
			var url = "https://"+_api_domain+"/rest/v2.add-url-for-checking";  
			var post_data = 'url='+encodeURIComponent(url_for_checking);
			plagtool._addTextSettingsToPost(post_data, custom_text_settings, function(post_data){
				plagtool._execHttpRequest(url, post_data, function(error, result){
					callback(error, result); // call batch callback
				});
			});
			
	 };
	 
	 /**
     * Add file for checking
     * 
     * @param string file_path
     * @param object|null custom_text_settings
     * @return object 
     */
	 this.addFileForChecking = function(file_path, custom_text_settings, callback){
			// @todo: test mime, and test size
			var fs = require('fs');
			var url = "https://"+_api_domain+"/rest/v2.add-file-for-checking";
			
			if(typeof(custom_text_settings) == "function"){
				callback = custom_text_settings;
				custom_text_settings = {ignore_quotation:false, search_on_site:null, internal_check:false};
			}
			
			fs.readFile(file_path, function read(err, file_data) {
				if (err) {
					throw err;
				}
				//process file
				var post_data = 'file_name='+encodeURIComponent(file_path)+'&file_data='+encodeURIComponent(file_data.toString('base64'));
				plagtool._addTextSettingsToPost(post_data, custom_text_settings, function(post_data){
					plagtool._execHttpRequest(url, post_data, function(error, result){
						callback(error, result); // call batch callback
					});
				});
			});
	 };
	
	/**
     * Returns completed percentage of text checking
     * 
     * @param string hash
     * @return object 
    */
	this.getTextStatus = function(hash, callback){
		var url = "https://"+_api_domain+"/rest/v2.get-text-status?hash="+hash;
		plagtool._execHttpRequest(url, function(error, result){
			callback(error, result); // call batch callback
		});
	 };
	
	/**
     * Returns checking result
     * array of ngrams and sources for ngrams
     * 
     * @param string hash
     * @return object 
    */
	this.getResult = function(hash, callback){
		var url = "https://"+_api_domain+"/rest/v2.get-result?hash="+hash;  
		plagtool._execHttpRequest(url, function(error, result){
			callback(error, result); // call batch callback
		});
	 };
	
	/**
     * Returns checking result with quotes
     * array of ngrams and sources with quotes for ngrams
     * 
     * @param string hash
     * @return object 
     */
	this.getResultWithQuotes = function(hash, callback){
		var url = "https://"+_api_domain+"/rest/v2.get-result-with-quotes?hash="+hash;
		plagtool._execHttpRequest(url, function(error, result){
			callback(error, result); // call batch callback
		});
	};
	
	/**
     * Returns plagiarism percent
     * 
     * @param string hash
     * @param string filter_host
     * @return object 
    */
	this.getPlagiarismPercent = function(hash, filter_host, callback){
		var url = "https://"+_api_domain+"/rest/v2.get-plagiarism-percent?hash="+hash+"&filter_host="+filter_host;
		plagtool._execHttpRequest(url, function(error, result){
			callback(error, result); // call batch callback
		});
	};
	
	/**
     * Returns text
     * 
     * @param string hash
     * @return object 
    */
	this.getText = function(hash, callback){
		var url = "https://"+_api_domain+"/rest/v2.get-text?hash="+hash;
		plagtool._execHttpRequest(url, function(error, result){
			callback(error, result); // call batch callback
		});
	};
	
	
	/**
     * Return count of api checks left
     * 
     * @return object
    */
	this.checkBalance = function(callback){
		var url = "https://"+_api_domain+"/rest/v2.get-check-left";
		plagtool._execHttpRequest(url, function(error, result){
			callback(error, result); // call batch callback
		});
	};
	
	/**
     * Returns last response
     * 
     * @return object 
    */
	this.getResponse = function(){
		return plagtool._response;
	};
	 
	/**
     * @param string post_data
     * @param object|null custom_text_settings
     * @return string
    */
	this._addTextSettingsToPost = function(post_data, custom_text_settings, callbak){
		 post_data += '&custom_text_settings='+encodeURIComponent(querystring.stringify(custom_text_settings));
		if(post_data) callbak(post_data);
	}; 
	
	/**
     *
     * @param string url
     * @param string post_data
     * @return object
    */
	this._execHttpRequest = function(url, post_data, callback){	
		//check if post_data
		if(typeof(post_data) == "function"){
			callback = post_data;
			post_data = false;
		}
		
		var options = {
			rejectUnauthorized: false,
			uri:url,
			json: true,
			followRedirect:false,
			timeout: config.CURL_TIMEOUT
		}
		if(post_data){
			options.headers = {'content-type' : 'application/x-www-form-urlencoded'};
			options.body = post_data;
			options.method = "POST";
		}
		console.log('POSTDATA:', options, url);
		request(options, function(error, response, body){
			if (!error) {
				plagtool._makeResponse(body, true, function(result){						
					if(callback) callback(null, result);
				});
			 }
			 else{
				if(callback) callback(error);
			 }
		}).auth(_login,_password);
		
    };
	
	/**
     *
     * @param object raw_response
     * @param bool recursive
     * @return mixed
    */
	this._makeResponse = function(raw_response, recursive, callback){
		var result = null;					
		if(raw_response)
		{
			if(recursive && raw_response.data && raw_response.data.isArray)
			{
				var data = raw_response.data;
				
				data.forEach(function(v, i, arr){
					plagtool._makeResponse(v, false, function(result){											
						raw_response.data[i] == result;
					});
				});
			}
			else{
			}			
					
			result = new plagtool.response(raw_response.status, raw_response.message, raw_response.data);
		}
		plagtool._response = result;
		if(callback) callback(result);
	};
	
	//alternative for Response class
	/**
     *
     * @param int status
     * @param string message
     * @param mixed data 
    */
	this.response = function(status, message, data){
		if(!status) return false;
		// console.log('in res:', message);
		//params
		var OK = 200;
		var UNAUTHORIZED = 401;
		var FORBIDDEN = 403;
		var NOT_FOUND = 404;
		var INTERNAL_SERVER_ERROR = 500;
		var SERVICE_UNAVAILABLE = 503;
		//vars
		var response = this;
		this._status = status;
		this._message = message;
		this._data = data;
		
		/**
		 * 
		 * 
		 * @return string
		*/
		this.getMessage = function(){
			return response._message;
		};
		
		/**
		 * 
		 * 
		 * @return mixed 
		*/
		this.getData = function(){
			return response._data;
		};		
		
		/**
		 * 
		 * 
		 * @return int 
		 */
		this.getStatus = function(){
			return response._status;
		};
		
		/**
		 * Returns true if last response was successful
		 * 
		 * @return bool 
		 */
		this.isSuccessfully = function(){
			return response._status == response.OK;
		};
		
		/**
		 * Returns true if happened temporary error
		 * 
		 * @return bool 
		 */
		this.isTemporaryError = function(){
			return response._status == response.SERVICE_UNAVAILABLE;
		};
		return response;
	};
};
 
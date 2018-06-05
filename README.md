Plagtoo API for NodeJS
========================

## Super simple to use

```javascript
var plagtool = require('plagtool');
var client = new plagtool('login','pass');
client.batch(['put','get','post'], function(error, result){
	if(!error){
		res.send(result.getMessage());
	}
});
```
Here is an example of the query for sending the text for checking:

```javascript
client.addTextForChecking(text,function(error, result){
	if(result){
		if(result.getData() == null) res.send(result.getMessage());
		var hash = result.getData();
		client.getTextStatus(hash, function(error, result){
				if(result.getData() == 100){
					client.getResult(hash, function(error, result){
						res.send(result.getData());
					});
				}			
		});
	}
	else{
		res.send(error.toString());
	}
});
```
To send text files for checking, use addFileForChecking method as below:

```javascript
client.addFileForChecking('file_path', function(error, result){
	if(result){
		res.send(result.getMessage());
	}
});
```	
var hash = {
	"meta" : {
		"domain" : "www.example.com",
		"mysql_database_name" : "onlyoneword",
		"mysql_database_prefix" : "13p4_",
		"user_name" : "a6b8",
		"password_insert" : "187",
		"docker_secrets" : "true",
		"start_on_create" : "false"
	},
	"dict" : {
		"wordpress-name-long" : "wordpress",
		"wordpress-name-short" : "wp",
		"wordpress-docker-image" : "wordpress",
		"wordpress-docker-image-version" : "4.9.8-php7.2-apache",
		"mysql-name-long" : "mysql",
		"mysql-name-short" : "mysql",
		"mysql-docker-image" : "mysql",
		"mysql-docker-image-version" : "8",
		"phpmyadmin-name-long" : "phpmyadmin",
		"phpmyadmin-name-short" : "pma",
		"phpmyadmin-docker-image" : "phpmyadmin/phpmyadmin",
		"phpmyadmin-docker-image-version" : "4.7",
		"rancher_secret_path" : "/run/secrets/",
	},
	"doms" : {
	   	"meta" : {
		   	"offset_x" : 50,
		   	"offset_y" : 50 
		},
		"on_screen_inputs" : [],
		"on_screen_yamls" : []
   },
	"yamls" : [
   		{ "name" : "rancher", "__txt" : "" },
   		{ "name" : "docker", "__txt" : "" },
   	   	{ "name" : "secrets", "__txt" : "" }
	]
}

function setup() {
	var a = create_docker_yaml(hash)
	hash["yamls"][0]["__txt"] = create_rancher_yaml(hash, a[1])
	hash["yamls"][1]["__txt"] = a[0]
	hash["yamls"][2]["__txt"] = create_secrets_file(a[2])
	draw_init(hash)
	draw_inputFillValues(hash)
	draw_recreateCodes()
}

function event_central() {
	console.log("dede")	

		//draw_inputFillValues(hash)
		draw_recreateCodes()
		  if (document.readyState === "complete") {
		  	event_setNewValuesToHash()

		  	var a = create_docker_yaml(hash)
		  	hash["yamls"][1]["__txt"] = a[0]
			hash["yamls"][0]["__txt"] = create_rancher_yaml(hash, a[1])
			hash["yamls"][2]["__txt"] = create_secrets_file(a[2])
		  	draw_recreateCodes()
		  }
}

function event_setNewValuesToHash() {
	var vals = draw_getDomIds(hash)
	for(var i = 0; i < vals.length; i++) {
		id = vals[i]["dom_id"]
		val_new = document.getElementById(id).value
		hash["meta"][vals[i]["name"]] = val_new
	}
}

function draw_getDomIds(obj) {
	var result = []
	var vals = Object.keys(obj["meta"])
	//console.log(Object.keys(obj["meta"]["placeholder"]))
	for(var i = 0; i < vals.length; i++) {
		var item = {
			"name" : vals[i],
			"dom_id" : i + "",
			"value" : obj["meta"][vals[i]]
		}
		result.push(item)
	}
	return result
}

function draw_init(obj) {
	var vals = draw_getDomIds(obj)
	aa = createSpan("YAML GENERATOR - Wordpress")
	aa.position(obj["doms"]["meta"]["offset_x"],0)
	aa.style("font-family", "Oswald")
	aa.style("font-size", "20px")

	bb = createButton("DOWNLOAD");	
	bb.position(350,10)
	bb.id("download")
	document.getElementById("download").onclick = event_download;

	offset_y_total = 0
	offset_y_intern = 20

	for(var i = 0; i < vals.length; i++) {
		offset_y_total = i*offset_y_intern
		var a = createSpan(vals[i]["name"])
		var b = createInput();
		var c = createP();
		a.style("font-family", "Oswald")

		var y = i*offset_y_intern+10
		if(i > 2) { y = y + 20 }
		
		a.position(obj["doms"]["meta"]["offset_x"] + 0, obj["doms"]["meta"]["offset_y"] + y)

		b.style("font-family", "Arial")
		b.position(obj["doms"]["meta"]["offset_x"] + 250, obj["doms"]["meta"]["offset_y"] + y)
		b.id(vals[i]["dom_id"])
		b.input(event_central)
		var d = [a, b]
		obj["doms"]["on_screen_inputs"].push(d)
	}

	var eee = createDiv("")
 	eee.size(300, offset_y_total +10)

	for(var i = 0; i < 2; i++) {
		var __txt = "docker"
		var e = createSpan(__txt)
		var f = createDiv("")
		f.child(e)
		f.style("background", "whitesmoke")
		e.id("yaml-" + i)
		obj["doms"]["on_screen_yamls"].push(f)
	}
}

function draw_inputFillValues(obj) {
	var vals = draw_getDomIds(obj)
	for(var i = 0; i < vals.length; i++) {
		document.getElementById(i).value = vals[i]["value"]
	}
}

function draw_recreateCodes() {
	for(var i = 0; i < hash["yamls"].length-1; i++) {
		var vals = {
			"code" : hash["yamls"][i]["__txt"]
		}
		var __txt = `
		<xmp>
{code}
</xmp>
`		

		var r = data_insertValsInTemplate(__txt, vals);
		document.getElementById("yaml-" + i).innerHTML = r
	}
}

function create_rancher_yaml(obj, images) {
	var result = ""
	var __txt_1 = `
version: '2'
services:`
	var __txt_2 = `
  {image_name}:
    scale: 1
    start_on_create: {start_on_create}`
	result = __txt_1
	for(var i = 0; i < images.length; i++) {
		item = {
			"image_name" : images[i],
			"start_on_create" : obj["meta"]["start_on_create"]
		}
		result += data_insertValsInTemplate(__txt_2, item)
	}
	return result
}

function create_secrets_file(secrets) {
	var result = ""

	for(var i = 0; i < secrets.length; i++) {
		result += secrets[i]["secret"] + ", " + secrets[i]["value"] + "\n"
	}
	return result
}


function create_docker_yaml(obj) {
	var result = []

	var vals_1 = {
		"wordpress-name" : {
			"secret" : "",
			"value" : data_codeToString(obj, "wordpress-name-long_-_domain--32")
		},
		"wordpress-volume" : {
			"secret" : "",
			"value" : data_codeToString(obj, "wordpress-name-short_-_password-1--32")
		},
		"wordpress-docker_image" : {
			"secret" : "",
			"value" : data_codeToString(obj, "wordpress-docker-image--32")
		},
		"wordpress-docker_image_version" : {
			"secret" : "",
			"value" : data_codeToString(obj, "wordpress-docker-image-version--32")
		},
		"mysql-name" : {
			"secret" : "",
			"value" : data_codeToString(obj, "mysql-name-long_-_domain--32")
		},
		"mysql-volume" : {
			"secret" : "",
			"value" : data_codeToString(obj, "mysql-name-short_-_password-1--32")
		},
		"mysql-database-name" : {
			"secret" : "",
			"value" : obj["meta"]["mysql_database_name"]
		},
		"mysql_database_prefix" : {
			"secret" : "",
			"value" : obj["meta"]["mysql_database_prefix"]
		},
		"mysql-password-user" : {
			"secret" : obj["meta"]["domain"].split(".").join("-") + "-" + data_codeToString(obj, "mysql-name-long--32") + "-user",
			"value" : data_codeToString(obj, "password-1--32")
		},
		"mysql-password-name" : {
			"secret" : obj["meta"]["domain"].split(".").join("-") + "-" + data_codeToString(obj, "mysql-name-long--32") + "-password-name",
			"value" : data_codeToString(obj, "user_-_password-1--32")
		},
		"mysql-password-root" : {
			"secret" : obj["meta"]["domain"].split(".").join("-") + "-" + data_codeToString(obj, "mysql-name-long--32") + "-password-root",
			"value" : data_codeToString(obj, "password-1--32")
		},
		"mysql-docker_image" : {
			"secret" : "",
			"value" : data_codeToString(obj, "mysql-docker-image--32")
		},
		"mysql-docker_image_version" : {
			"secret" : "",
			"value" : data_codeToString(obj, "mysql-docker-image-version--32")
		},
		"phpmyadmin-name" : {
			"secret" : "",
			"value" : data_codeToString(obj, "phpmyadmin-name-long_-_password-1--32")
		},
		"phpmyadmin-docker_image" : {
			"secret" : "",
			"value" : data_codeToString(obj, "phpmyadmin-docker-image--32")
		},
		"phpmyadmin-docker_image_version" : {
			"secret" : "",
			"value" : data_codeToString(obj, "phpmyadmin-docker-image-version--32")
		}
	}

	var k = Object.keys(vals_1)
	vals = {}
	secrets = []
	
	for(var i = 0; i < k.length; i++) {
		if(obj["meta"]["docker_secrets"] == "true") {
			// with secrets
			if(vals_1[k[i]]["secret"] != "") {
				vals[k[i]] = "/run/secrets/" + vals_1[k[i]]["secret"]
				secrets.push(vals_1[k[i]])
			} else {
			vals[k[i]] = vals_1[k[i]]["value"]
			}
		} else {
			vals[k[i]] = vals_1[k[i]]["value"]
			// without secrets
		}
	}

	vals["secrets_intern"] = ""
	vals["secrets_extern"] = ""
	vals["_FILE"] = ""
	if(obj["meta"]["docker_secrets"] == "true") {
		vals["secrets_intern"] = `secrets:
`
		vals["secrets_extern"] = `secrets:
`
		vals["_FILE"] = "_FILE"
		for(var i = 0; i < secrets.length; i++) {
			vals["secrets_intern"] += "    - " + secrets[i]["secret"] + "\n"
			vals["secrets_extern"] += "  " + secrets[i]["secret"] + ":\n"
			vals["secrets_extern"] += "      external: true" + "\n"
		}
	}

	var __txt = `
version: '2'
volumes:
  {mysql-volume}:
    driver: local
  {wordpress-volume}:
    driver: local
services:
  {wordpress-name}:
    image: {wordpress-docker_image}:{wordpress-docker_image_version}
    environment:
      WORDPRESS_DB_HOST: {mysql-name}:3306
      WORDPRESS_DB_PASSWORD{_FILE}: {mysql-password-user}
      WORDPRESS_DB_USER{_FILE}: {mysql-password-name}
      WORDPRESS_DB_NAME: {mysql-database-name}
      WORDPRESS_TABLE_PREFIX: {mysql_database_prefix}
    volumes:
    - {wordpress-volume}:/var/lib/wordpress
    {secrets_intern}
  {mysql-name}:
    image: {mysql-docker_image}:{mysql-docker_image_version}
    command: '--default-authentication-plugin=mysql_native_password'
    environment:
      MYSQL_DATABASE: {mysql-database-name}
      MYSQL_PASSWORD{_FILE}: {mysql-password-user}
      MYSQL_ROOT_PASSWORD{_FILE}: {mysql-password-root}
      MYSQL_USER{_FILE}: {mysql-password-name}
    volumes:
    - {mysql-volume}:/var/lib/mysql
    {secrets_intern}
  {phpmyadmin-name}:
    image: {phpmyadmin-docker_image}:{phpmyadmin-docker_image_version}
    environment:
      PMA_HOST: {mysql-name}
      PMA_PORT: 3306
      PMA_ARBITRARY: '1'
    links:
    - {mysql-name}:db
{secrets_extern}`

	result[0] = data_insertValsInTemplate(__txt, vals)

	var rancher = [
		vals["wordpress-name"],
		vals["mysql-name"],
		vals["phpmyadmin-name"]
	]

	result[1] = rancher
	result[2] = secrets
	return result
}

function data_codeToString(obj, str) {
	var cut = str.substring(str.indexOf("--")+2, str.length)*1
	str = str.substring(0, str.indexOf("--"))
	var commands = str.split("_")
	var dict = Object.keys(obj["dict"])
	var result = ""

	for(var i = 0; i < commands.length; i++) {
		switch(commands[i]) {
			case "-":
				result += "-"
				break;
			case "user":
				result += obj["meta"]["user_name"]
				break;
			case "password-1":
				result += data_generatePassword(cut, obj)

				break;
			case "domain":
				result += obj["meta"]["domain"].split(".").join("-")
				break;
			default:
				for(var j = 0; j < dict.length; j++) {
					//console.log(commands[i] + "  -  " + dict[j])
					if(commands[i] == dict[j]) {
						result += obj["dict"][dict[j]]
						break;
					}
				}
				break;
				//console.log(commands[i])
		}
	}

	result = result.substring(0, cut)
	return result
}

function data_generatePassword(password_length, obj) {
	var result = ""
	var chars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
	for(var i = 0; i < password_length; i++) {
		var l = chars.length - 1
		var random = (Math.floor(Math.random() * (l - 0 + 1)) + 0);
		result += chars[random]
	}

	var phrase = obj["meta"]["password_insert"]
	var l = password_length - phrase.length
	var random = Math.floor(Math.random() * (l - 0 + 1)) + 0;
	result = result.splice(random, 0, phrase) 
	result.splice(random, 0, phrase);
	result = result.substring(0, password_length)
	return result
}

function data_insertValsInTemplate(template, variables) {
    return template.replace(new RegExp("\{([^\{]+)\}", "g"), function(_unused, varName){
        return variables[varName];
    });
}

String.prototype.splice = function(idx, rem, str) {
    return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
};

function event_download() {
	var vals = {
		"rancher" : {
			"name" : "rancher-compose.yml",
			"content" : hash["yamls"][0]["__txt"]
		},
		"docker" : {
			"name" : "docker-compose.yml",
			"content" : hash["yamls"][1]["__txt"]
		},
		"secrets" : {
			"name" : "secrets.txt",
			"content" : hash["yamls"][2]["__txt"]
		}
	}

	var zip = new JSZip();
	zip.file(vals["rancher"]["name"], vals["rancher"]["content"]);
	zip.file(vals["docker"]["name"], vals["docker"]["content"]);
	zip.file(vals["secrets"]["name"], vals["secrets"]["content"]);
	//var img = zip.folder("docker-compose");
	zip.generateAsync({type:"blob"}).then(function(content) {
	    // see FileSaver.js
	    f = hash["meta"]["domain"]+"-yaml-wordpress.zip"
	    f = f.replace(".", "-")
	    saveAs(content, f);
	});
}

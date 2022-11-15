let model_five_diseases = null;
let model_pneumonia = null;
let model_lung_cancer = null;
//let model_nature = null;
//#################################################################################
// ### MODELS LOAD
//#################################################################################
async function loadmodelsFunction(cancer_type_selected){

	console.log("Downloading models for: ", cancer_type_selected)

	if (cancer_type_selected == 'Breast') {
		
	}

	if (cancer_type_selected == 'Lung') {
			console.log("downloading...")
			var progressgraphic = document.getElementById("progress_bar");
			progressgraphic.style.width = "0%";

			model_lung_hnh = await tf.loadLayersModel('https://raw.githubusercontent.com/bachtses/Medical-Report-Generation-Tool-First-Prototype/main/models/X-Ray_Lung_Cancer_Classification/model.json', {
				onProgress: function (fraction) {
					//console.log(Math.round(100*fraction))
					if (fraction == 1) {
						console.log("downloaded : Lung Healthy-Non Healthy model")
						progressgraphic.style.width = "33%";
					}
				}
			});	
			model_lung_tnm = await tf.loadLayersModel('https://raw.githubusercontent.com/bachtses/Medical-Report-Generation-Tool-First-Prototype/main/models/X-Ray_5_Diseases_Classification/model.json', {
			onProgress: function (fraction) {
				//console.log(Math.round(100*fraction))
				if (fraction == 1) {
					console.log("downloaded : TNM staging model")
					progressgraphic.style.width = "66%";
				}
			}
			});
			model_pneumonia = await tf.loadLayersModel('https://raw.githubusercontent.com/bachtses/Medical-Report-Generation-Tool-First-Prototype/main/models/X-Ray_Pneumonia_Detection/model.json', {
				onProgress: function (fraction) {
					//console.log(Math.round(100*fraction))
					if (fraction == 1) {
						console.log("downloaded : Pneumonia model")
						progressgraphic.style.width = "99%";
					}
				}
			});
			
			//model_nature = await tf.loadLayersModel('https://raw.githubusercontent.com/bachtses/Chest_X-Ray_Medical_Report_Web_App/main/models/X-Ray_Nature_Classification/model.json');
			//console.log("MODEL DOWNLOADED!: Nature");

			document.getElementById("divModelDownloadFraction").style.marginTop = "22%";
			document.getElementById("divModelDownloadFraction").innerHTML = "The required AI models for Lung Cancer have been downloaded succesfully: <br><br>Lung X-ray Classification model<br>Lung CT Segmentation model<br>Lung Metastasis model<br>Lung TNM Staging model<br><br><h1 style='font-size:20px;'>Please proceed to the image upload</h1><br> <a class='proceed_button' onclick='uploadContainer()'><i class='fa-solid fa-angle-right'></i>  Proceed</a>";
	
	}

	if (cancer_type_selected == 'Prostate') {

	}

	if (cancer_type_selected == 'Colorectal') {
		
	}
	
}


//#################################################################################
// ### MENU
//#################################################################################
let cancer_type_selected = null;

async function cancertypeSelection(cancertypeselection) {
	cancer_type_selected = cancertypeselection;
	document.getElementById("menuoptions_container").style.display = "none";
	document.getElementById("notifications_container").style.display = "inline";
	await loadmodelsFunction(cancer_type_selected);
}

async function notificationsPanel() {
	document.getElementById("notifications_container").style.display = "inline";
	document.getElementById("upload_container").style.opacity = "0";
	document.getElementById("report_container").style.display = "none";
	
}

// onclick of "proceed" button
async function uploadContainer() {
	document.getElementById("notifications_container").style.display = "none";
	document.getElementById("upload_container").style.opacity = "1";
	document.getElementById("report_container").style.display = "none";

}




//#################################################################################
// ### DISPLAY DICOM IMAGE
//#################################################################################
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
let loaded = false;

var element = document.getElementById('idImage');
cornerstone.enable(element);


//#################################################################################
// ### IMAGE LOAD
//#################################################################################
var allowed_extensions_for_dicom_formats = new Array("dcm");
var allowed_extensions_for_other_formats = new Array("jpeg","jpg","png");
var clicked_button_value = null


async function buttonClicked(value) {
	clicked_button_value = value;
	console.log("\n\nBUTTON CLICKED : ", clicked_button_value)
}


async function showFiles(event) {
	console.log("CLICKED VALUE : ", clicked_button_value)

	// read the file from the user
    let file = document.querySelector('input[type=file]').files[0];
	console.log("\nNEW UPLOADED FILE: \n", file)
	var fileName = file.name;
	var file_extension = fileName.split('.').pop().toLowerCase(); 
 
	if (allowed_extensions_for_dicom_formats.includes(file_extension)){
		$("#initial_image_display").fadeOut("fast");
		$(".cornerstone-canvas").fadeIn("fast");
		
		var imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
		const element = document.getElementById('idImage');

		cornerstone.loadImage(imageId).then(function(image) {
			const viewport = cornerstone.getDefaultViewportForImage(element, image);
			cornerstone.displayImage(element, image, viewport);
		});
		imagesPreprocessor(clicked_button_value);
		
	}else if (allowed_extensions_for_other_formats.includes(file_extension)){
		$(".cornerstone-canvas").fadeOut("fast");
		$("#initial_image_display").fadeIn("fast");

		// An empty img element
		let demoImage = document.getElementById('initial_image_display');
		console.log("new image: ", demoImage)

		// read the file from the user
		let file = document.querySelector('input[type=file]').files[0];
		
		const reader = new FileReader();
		reader.onload = function (event) {
			demoImage.src = reader.result;     
		}
		reader.readAsDataURL(file);

		imagesPreprocessor(clicked_button_value);
	}	
}  
 


//#################################################################################
// ### LUNG
//#################################################################################
var image_lung_xray = null;
var image_lung_ct = null;
var image_lung_petct = null;

async function imagesPreprocessor(clicked_button_value) {

	let file = document.querySelector('input[type=file]').files[0];
	fileName = file.name;
	var file_extension = fileName.split('.').pop().toLowerCase(); 	
	if(allowed_extensions_for_dicom_formats.includes(file_extension)){
		var img_ = document.getElementById('idImage').getElementsByClassName("cornerstone-canvas")[0];
	}else if(allowed_extensions_for_other_formats.includes(file_extension)){
		var img_ = document.getElementById('initial_image_display');
	}
	//console.log("img_: ", img_);

	if (clicked_button_value == "lungxray"){ 
		image_lung_xray = img_;
		//console.log("uploaded image: ", image_lung_xray);
		//console.log("uploaded image stored in variable: image_lung_xray ");
	}else if(clicked_button_value == "lungct"){
		image_lung_ct = img_;
		//console.log("uploaded image: ", image_lung_ct);
		//console.log("uploaded image stored in variable: image_lung_ct ");
	}	else if(clicked_button_value == "lungpetct"){
		image_lung_petct = img_;
		//console.log("uploaded image: ", image_lung_petct);
		//console.log("uploaded image stored in variable: image_lung_petct ");
	}
}

async function getMedicalreport() {
	console.log("\n\n\nTOTAL UPLOADED IMAGES : ")
	console.log("\nimage_lung_xray:",image_lung_xray, "\nimage_lung_ct: ", image_lung_ct, "\nimage_lung_petct: ", image_lung_petct);
	
	document.getElementById("notifications_container").style.display = "none";
	document.getElementById("upload_container").style.display = "none";
	document.getElementById("report_container").style.display = "block";


	predict(image_lung_xray, image_lung_ct, image_lung_petct);

}



//#################################################################################
// ### PREDICTIONS
//#################################################################################
var fileName = null;


async function predict(image_lung_xray, image_lung_ct, image_lung_petct){
	
	console.log("\n\n\nSTART RUNNING THE MODELS")
	var modalities_uploaded = '';

	if (image_lung_xray !== null) {
		console.log("running for:  image_lung_xray")
		modalities_uploaded += 'X-Ray ';

		// _____________________  PREPROCESS THE IMAGES  ______________________  
		// model lungcancer classification h/nh
		let tensor_lung_hnh = tf.browser.fromPixels(image_lung_xray)
		.resizeNearestNeighbor([128,128]) // change the image size here
		.toFloat()
		.div(tf.scalar(255.0))
		.expandDims();
		console.log("input for lungcancer_hnh model: ", tensor_lung_hnh.shape)

		// model five diseases classification
		let tensor_lung_tnm = tf.browser.fromPixels(image_lung_xray)
		.resizeNearestNeighbor([224,224]) // change the image size here
		.toFloat()
		.div(tf.scalar(255.0))
		.expandDims();
		console.log("input for lungcancer_tnm model: ", tensor_lung_tnm.shape)


		// model pneumonia classification
		let tensor_pneumonia = tf.browser.fromPixels(image_lung_xray)
		.resizeNearestNeighbor([200,200]) // change the image size here
		.toFloat()
		.expandDims();

		// model nature classification ---------->  PYTORCH MODEL
		//let tensor_nature = tf.browser.fromPixels(img_)
		//.resizeNearestNeighbor([150,150]) // change the image size here
		//.toFloat()
		//.div(tf.scalar(255.0))
		//.expandDims();
		//tensor_nature.shape.reverse();
		//tensor_nature = tf.squeeze(tensor_nature);
		//tensor_nature = tf.expandDims(tensor_nature);


		console.log(tensor_pneumonia.shape)
		//console.log(tensor_nature.shape)

		document.getElementById("divModelDownloadFraction").style.display = "none";
		document.getElementById("divModelDownloadFraction").style.lineHeight = "0px";
		document.getElementById("divModelDownloadFraction").style.height = "0px";
		console.log("\n")



		// _____________________  PERFORM PREDICTIONS  ______________________     
		let predictions_lung_hnh = await model_lung_hnh.predict(tensor_lung_hnh).data(); //model lung healthy - non healthy predictions
		predictions_lung_hnh[1] = 1 - predictions_lung_hnh[0];
		let predictions_lung_tnm = await model_lung_tnm.predict(tensor_lung_tnm).data(); //model lung tnm staging predictions
		predictions_lung_tnm = [1, 1, 0]	      //THIS IS AN EXAMPLE FOR DEMONSTRATION PURPOSES! TO BE DELETED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		let predictions_pneumonia = await model_pneumonia.predict(tensor_pneumonia).data(); //model pneumonia predictions
		predictions_pneumonia[1] = 1 - predictions_pneumonia[0];
	
		//let predictions_nature = await model_nature.predict(tensor_nature).data(); //model nature classification


		// _____________________  DEFINE LABELS  ______________________ 
		var LABELS_lung_hnh = ['Healthy [H]', 'Non Healthy [NH]'];
		let RESULTS_lung_hnh = Array.from(predictions_lung_hnh)
		RESULTS_lung_hnh = RESULTS_lung_hnh.map(function(each_element){
			return Number(each_element.toFixed(3));
		});
		console.log("predictions lung healthy-non healthy:\n"+ RESULTS_lung_hnh)

		var LABELS_lung_tnm = ['Size [T]', 'Nodes invasion [N]', 'Metastasis [M]'];		
		let RESULTS_lung_tnm = Array.from(predictions_lung_tnm)  //i.e. const RESULTS = ["0", "0", "1"]
		RESULTS_lung_tnm = RESULTS_lung_tnm.map(function(each_element){
			return Number(each_element.toFixed(3));
		});
		console.log("predictions TNM staging:\n"+ RESULTS_lung_tnm)

		var LABELS_pneumonia = ['Metastasis [M1]', 'No Metastasis [M0]'];
		let RESULTS_pneumonia = Array.from(predictions_pneumonia)
		RESULTS_pneumonia = RESULTS_pneumonia.map(function(each_element){
			return Number(each_element.toFixed(3));
		});
		console.log("predictions pneumonia:\n"+ RESULTS_pneumonia)
		//console.log("predictions nature:\n"+ predictions_nature)
		
		// _____________________  CONSTRUCT THE SENTENCES  ______________________ 
		//Healthy - Non Healthy
		var found_a_disease = 0;
		var text_lung_hnh = '';
		if (predictions_lung_hnh[0] > predictions_lung_hnh[1]) {
			text_lung_hnh = 'The lungs appear to be healthy without any abnormal mass or nodule and also with no any oncological findings.'
		}
		else {
			text_lung_hnh = 'The lungs appear to contain oncological findings, specifically lung tumor with an abnormal mass or nodule.'
			found_a_disease = 1;
		}
		var text_clear_report = '';
		if (found_a_disease == 0) {
			text_clear_report = 'Overall, there is no evidence of an active disease and the lungs are clear.'
		}

		//TNM staging

		//T size
		var text_lung_T = '';
		var predefined_sentences_T = ['T0', 'T1 3cm or smaller and contained within the lung', 'T2 '];
		if (RESULTS_lung_tnm[0] <= 0.5) {
			text_lung_T += predefined_sentences_T[0];
		}
		else {
			text_lung_T += predefined_sentences_T[1];
		}

		//N nodes invasion
		var text_lung_N = '';
		var predefined_sentences_N = ['N0','N1 There are cancer cells in lymph nodes within the lung or in lymph nodes in the area where the lungs join the airway (the hilum)', 'N2 There is cancer in lymph nodes: in the centre of the chest (mediastinum) on the same side as the affected lung or just under where the windpipe branches off to each lung'];
		if (RESULTS_lung_tnm[1] <= 0.5) {
			text_lung_N += predefined_sentences_N[0];
		}
		else {
			text_lung_N += predefined_sentences_N[1];
		}

		//M metastasis
		var text_lung_M = '';
		var predefined_sentences_M = ['M0 the cancer has not spread to another lobe of the lung or any other part of the body', 'M1 the cancer has spread to other areas of the body'];
		if (RESULTS_lung_tnm[2] <= 0.5) {
			text_lung_M += predefined_sentences_M[0];
		}
		else {
			text_lung_M += predefined_sentences_M[1];
		}
		

		var text_pneumonia = '';
		if (predictions_pneumonia[0] > predictions_pneumonia[1]) {
			text_pneumonia = 'test111'
			found_a_disease = 1;
		}
		else {
			text_pneumonia = 'test11'
		}

		
		var slow_velocity = 500;

		// Clear the previous session and display the results of medical report
		$('#summary_title').fadeOut(slow_velocity, function(){
			$("#summary_title").hide();
			$("#summary_title").replaceWith(`<p id="summary_title">Medical Report Summary</p>`);
			$('#summary_title').fadeIn(slow_velocity);
		}); 

		$('#image_name').fadeOut(slow_velocity, function(){
			$("#image_name").hide();
			$("#image_name").replaceWith(`<h1 id="image_name">Uploaded Scan: ${fileName} </h1>`);
			$('#image_name').fadeIn(slow_velocity);
		});
		$('#image_modality').fadeOut(slow_velocity, function(){
			$("#image_modality").hide();
			var todayDate = new Date().toISOString().slice(0, 10);
			$("#image_modality").replaceWith(`<h2>Imaging Modality:  &nbsp; Location: Chest/Thorax &nbsp; Date: ${todayDate}</h2>`);
			$('#image_modality').fadeIn(slow_velocity);
		});
		$('#findings').fadeOut(slow_velocity, function(){
			$("#findings").hide();
			$("#findings").replaceWith(`<h3 id="findings" style="border-bottom: 1px solid #363634;">Findings</h3>`);
			$('#findings').fadeIn(slow_velocity);
		});
		$('#gridrow1').fadeOut(slow_velocity, function(){
			$("#gridrow1").hide();
			$("#gridrow1").replaceWith(`<div class="gridrow" id="gridrow1" style="border-bottom: 1px solid #363634;"><li>${LABELS_lung_hnh[0]}</li><li>${LABELS_lung_hnh[1]}</li></div>`);
			$('#gridrow1').fadeIn(slow_velocity);
		});
		$('#gridrow2').fadeOut(slow_velocity, function(){
			$("#gridrow2").hide();
			$("#gridrow2").replaceWith(`<div class="gridrow" id="gridrow2"><li>${RESULTS_lung_hnh[0]}</li><li>${RESULTS_lung_hnh[1]}</li></div>`);
			$('#gridrow2').fadeIn(slow_velocity);
		});
		$('#gridrow3').fadeOut(slow_velocity, function(){
			$("#gridrow3").hide();
			$("#gridrow3").replaceWith(`<div class="gridrow" id="gridrow3" style="border-bottom: 1px solid #363634;"><li>${LABELS_lung_tnm[0]}</li><li>${LABELS_lung_tnm[1]}</li><li>${LABELS_lung_tnm[2]}</li></div>`);
			$('#gridrow3').fadeIn(slow_velocity);
		});
		$('#gridrow4').fadeOut(slow_velocity, function(){
			$("#gridrow4").hide();
			$("#gridrow4").replaceWith(`<div class="gridrow" id="gridrow4"><li>T${RESULTS_lung_tnm[0]}</li><li>N${RESULTS_lung_tnm[1]}</li><li>M${RESULTS_lung_tnm[2]}</li></div>`);
			$('#gridrow4').fadeIn(slow_velocity);
		});
		$('#gridrow5').fadeOut(slow_velocity, function(){
			$("#gridrow5").hide();
			$("#gridrow5").replaceWith(`<div class="gridrow" id="gridrow5" style="border-bottom: 1px solid #363634;"><li>${LABELS_pneumonia[0]}</li><li>${LABELS_pneumonia[1]}</li></div>`);
			$('#gridrow5').fadeIn(slow_velocity);
		});
		$('#gridrow6').fadeOut(slow_velocity, function(){
			$("#gridrow6").hide();
			$("#gridrow6").replaceWith(`<div class="gridrow" id="gridrow6"><li>${RESULTS_pneumonia[0]}</li><li>${RESULTS_pneumonia[1]}</li></div>`);
			$('#gridrow6').fadeIn(slow_velocity);
		});

		$('#prediction_list').fadeOut(slow_velocity, function(){
			$("#prediction_list").hide();
			$("#prediction_list").replaceWith(`<h4 id='prediction_list'>The diagnostic report for the patient of the scan "${fileName}", summarizes the following details. Following the TNM staging system, the size of the tumour is ${text_lung_T}. ${text_lung_N}.  Also, in terms of metastasis ${text_lung_M}. ${text_clear_report}</h4>`);
			$('#prediction_list').fadeIn(slow_velocity);
		});
	}


	if (image_lung_ct !== null) {
		console.log("running for: image_lung_ct")
		modalities_uploaded += 'CT ';

		console.log("image_lung_ct: ", image_lung_ct);		


	}

	if (image_lung_petct !== null) {
		console.log("running for: image_lung_petct")
		modalities_uploaded += 'PET/CT ';
	}



	//document.getElementById('testCanvas').getContext('2d').canvas.width = img_.width;
	//document.getElementById('testCanvas').getContext('2d').canvas.height = img_.height;
	//document.getElementById('testCanvas').getContext('2d').drawImage(img_, 0, 0, img_.width, img_.height);

	//export button visible
	$('.export_button').fadeIn(slow_velocity);
	//text editable button visible
	$('.textedit_button').fadeIn(slow_velocity);

}




//#################################################################################
// ### MAKE REPORT TEXT EDITABLE
//#################################################################################
async function MakeTextEditable(){
	$('#prediction_list').css('color', '#BABABA');
	setTimeout(function(){ MakeTextEditableMechanism(); }, 400);
}

async function MakeTextEditableMechanism(){
	console.log("Manual report edit")
	$('#prediction_list').css('color', '#363634');
	
	var post = $("#prediction_list").clone();
	post.find("span:not(.post_tag):not(.post_mentioned)").remove();
	post = $.trim(post.text());

	console.log("Characters count: ", post.length);
	//make the text editable
	$('#prediction_list').attr('contenteditable', 'true');
	//change the cursor style
	document.getElementById("prediction_list").style.cursor = "text";

	input = document.querySelector('#prediction_list');
    settings = {
      	maxLen: 430,
    }
	keys = {'backspace': 8,'shift': 16,'ctrl': 17,'alt': 18,'delete': 46,'leftArrow': 37,'upArrow': 38,'rightArrow': 39,'downArrow': 40, }
	utils = {special: {},
			navigational: {},
			isSpecial(e) {return typeof this.special[e.keyCode] !== 'undefined';},
			isNavigational(e) {return typeof this.navigational[e.keyCode] !== 'undefined';}
	}
	utils.special[keys['backspace']] = true;
	utils.special[keys['shift']] = true;
	utils.special[keys['ctrl']] = true;
	utils.special[keys['alt']] = true;
	utils.special[keys['delete']] = true;
	utils.navigational[keys['upArrow']] = true;
	utils.navigational[keys['downArrow']] = true;
	utils.navigational[keys['leftArrow']] = true;
	utils.navigational[keys['rightArrow']] = true;
	
	input.addEventListener('keydown', function(event) {
		let len = event.target.innerText.trim().length;
		hasSelection = false;
		selection = window.getSelection();
		isSpecial = utils.isSpecial(event);
		isNavigational = utils.isNavigational(event);
		if (selection) {
		  hasSelection = !!selection.toString();
		}
		if (isSpecial || isNavigational) {
		  return true;
		}
		if (len >= settings.maxLen && !hasSelection) {
		  event.preventDefault();
		  return false;
		}
	});
}


//#################################################################################
// ### EXPORT TO PDF
//#################################################################################
function DownloadScreenshotPDF() {	
	let iframe = document.createElement("iframe");
	iframe.setAttribute("id", "iframe");
	iframe.style.width = "1380px";
	iframe.style.height = "100%";
	iframe.style.visibility = 'hidden';      

	document.body.appendChild(iframe);
	let html = document.documentElement.outerHTML;
	iframe.srcdoc = html;
	iframe.addEventListener("load", () => {
		html2canvas(iframe.contentWindow.document.getElementById("content"),{background: '#fff'}).then(function(canvas) {
			//let link = document.createElement("a");
			//link.download = "Medical_Report.jpg";
			//canvas.toBlob( function(blob) {
			//	link.href = URL.createObjectURL(blob);
			//	link.click();
			//}, 'image/jpg');
			//document.body.appendChild(canvas);
			var imgData = canvas.toDataURL("image/png", 1.0);
			var pdf = new jsPDF("l", "px", [742, 480]);
			pdf.addImage(imgData, 'PNG', 0, 0, 742, 480);
			pdf.save('report_export.pdf');
			$("#iframe").replaceWith(``);
		});
	});
	console.log("PDF exported")
}










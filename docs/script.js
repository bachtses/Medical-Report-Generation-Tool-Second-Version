const model_five_diseases = null;
let model_pneumonia = null;
const model_lung_cancer = null;
//let model_nature = null;
//#################################################################################
// ### MODELS LOAD
//#################################################################################
async function loadmodelsFunction(cancer_type_selected) {
	console.log("Downloading models for: ", cancer_type_selected);

	if (cancer_type_selected === "Breast") {
	}

	if (cancer_type_selected === "Lung") {
		console.log("downloading...");
		const progressgraphic = document.getElementById("progress-bar");
		progressgraphic.style.width = "0%";

		model_lung_hnh = await tf.loadLayersModel(
			"https://raw.githubusercontent.com/valab-certh/medical-report-generation-tool/main/docs/prm/models/X-Ray_Gender_Classification/model.json",
			{
				onProgress: (fraction) => {
					//console.log(Math.round(100*fraction))
					if (fraction === 1) {
						console.log("downloaded : Lung Healthy-Non Healthy model");
						progressgraphic.style.width = "33%";
					}
				},
			},
		);
		model_lung_tnm = await tf.loadLayersModel(
			"https://raw.githubusercontent.com/valab-certh/medical-report-generation-tool/main/docs/prm/models/X-Ray_5_Diseases_Classification/model.json",
			{
				onProgress: (fraction) => {
					//console.log(Math.round(100*fraction))
					if (fraction === 1) {
						console.log("downloaded : TNM staging model");
						progressgraphic.style.width = "66%";
					}
				},
			},
		);
		model_pneumonia = await tf.loadLayersModel(
			"https://raw.githubusercontent.com/valab-certh/medical-report-generation-tool/main/docs/prm/models/X-Ray_Pneumonia_Detection/model.json",
			{
				onProgress: (fraction) => {
					//console.log(Math.round(100*fraction))
					if (fraction === 1) {
						console.log("downloaded : Pneumonia model");
						progressgraphic.style.width = "99%";
					}
				},
			},
		);

		//model_nature = await tf.loadLayersModel('https://raw.githubusercontent.com/bachtses/Chest_X-Ray_Medical_Report_Web_App/main/prm/models/X-Ray_Nature_Classification/model.json');
		//console.log("MODEL DOWNLOADED!: Nature");

		document.getElementById("div-model-download-fraction").style.marginTop =
			"22%";
		document.getElementById("div-model-download-fraction").innerHTML =
			"The required AI models for Lung Cancer have been downloaded succesfully: <br><br>Lung X-ray Classification model<br>Lung CT Segmentation model<br>Lung Metastasis model<br>Lung TNM Staging model<br><br><h1 style='font-size:20px;'>Please proceed to the image upload</h1><br> <a class='proceed_button' onclick='uploadContainer()'><i class='fa-solid fa-angle-right'></i>  Proceed</a>";
	}

	if (cancer_type_selected === "Prostate") {
	}

	if (cancer_type_selected === "Colorectal") {
	}
}

//#################################################################################
// ### MENU
//#################################################################################
let cancer_type_selected = null;

async function cancertypeSelection(cancertypeselection) {
	cancer_type_selected = cancertypeselection;
	document.getElementById("menuoptions-container").style.display = "none";
	document.getElementById("notifications-container").style.display = "inline";
	await loadmodelsFunction(cancer_type_selected);
}

async function notificationsPanel() {
	document.getElementById("notifications-container").style.display = "inline";
	document.getElementById("upload-container").style.opacity = "0";
	document.getElementById("report-container").style.display = "none";
}

// onclick of "proceed" button
async function uploadContainer() {
	document.getElementById("notifications-container").style.display = "none";
	document.getElementById("upload-container").style.opacity = "1";
	document.getElementById("report-container").style.display = "none";
}

//#################################################################################
// ### DISPLAY DICOM IMAGE
//#################################################################################
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
const loaded = false;

const element = document.getElementById("idImage");
cornerstone.enable(element);

//#################################################################################
// ### IMAGE LOAD
//#################################################################################
const allowed_extensions_for_dicom_formats = new Array("dcm");
const allowed_extensions_for_other_formats = new Array("jpeg", "jpg", "png");
let clicked_button_value = null;

async function buttonClicked(value) {
	clicked_button_value = value;
	console.log("BUTTON CLICKED : ", clicked_button_value);
}

async function showFiles(event) {
	console.log("CLICKED VALUE : ", clicked_button_value);

	// read the file from the user
	const file = document.querySelector("input[type=file]").files[0];
	console.log("\nNEW UPLOADED FILE: \n", file)
	const fileName = file.name;
	const file_extension = fileName.split(".").pop().toLowerCase();

	if (allowed_extensions_for_dicom_formats.includes(file_extension)) {
		$("#initial-image-display").fadeOut("fast");
		$(".cornerstone-canvas").fadeIn("fast");

		const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file);
		const element = document.getElementById("idImage");

		cornerstone.loadImage(imageId).then((image) => {
			const viewport = cornerstone.getDefaultViewportForImage(element, image);
			cornerstone.displayImage(element, image, viewport);
		});
		imagesPreprocessor(clicked_button_value);
	} else if (allowed_extensions_for_other_formats.includes(file_extension)) {
		$(".cornerstone-canvas").fadeOut("fast");
		$("#initial-image-display").fadeIn("fast");

		// An empty img element
		const demoImage = document.getElementById("initial-image-display");
		//console.log("new image: ", demoImage)

		// read the file from the user
		const file = document.querySelector("input[type=file]").files[0];

		const reader = new FileReader();
		reader.onload = (event) => {
			demoImage.src = reader.result;
		};
		reader.readAsDataURL(file);

		imagesPreprocessor(clicked_button_value);
	}
}

//#################################################################################
// ### LUNG
//#################################################################################
let image_lung_xray = null;
let image_lung_ct = null;
let image_lung_petct = null;
let img_ = null;

async function imagesPreprocessor(clicked_button_value) {
	const file = document.querySelector("input[type=file]").files[0];
	fileName = file.name;
	const file_extension = fileName.split(".").pop().toLowerCase();
	if (allowed_extensions_for_dicom_formats.includes(file_extension)) {
		img_ = document
			.getElementById("idImage")
			.getElementsByClassName("cornerstone-canvas")[0];
	} else if (allowed_extensions_for_other_formats.includes(file_extension)) {
		img_ = document.getElementById("initial-image-display");
	}

	//console.log("img_: ", img_);
	if (clicked_button_value === "lungxray") {
		image_lung_xray = img_;
		//console.log("uploaded image stored in variable: image_lung_xray ");
	} else if (clicked_button_value === "lungct") {
		image_lung_ct = img_;
		//console.log("uploaded image: ", image_lung_ct);
		//console.log("uploaded image stored in variable: image_lung_ct ");
	} else if (clicked_button_value === "lungpetct") {
		image_lung_petct = img_;
		//console.log("uploaded image: ", image_lung_petct);
		//console.log("uploaded image stored in variable: image_lung_petct ");
	}
}

async function uploadimagesChecker() {
	if (image_lung_xray == null) {
		$("#instructions-area-h1").replaceWith(
			`<h1 id="instructions-area-h1">X-ray scan is required.</h1>`,
		);
	} else {
		$("#instructions-area-h1").replaceWith(
			`<h1 id="instructions-area-h1">Medical report is getting prepared.</h1>`,
		);
		getMedicalreport();
	}
}

async function getMedicalreport() {
	console.log("\n\n\nTOTAL UPLOADED IMAGES : ");
	console.log(
		"image_lung_xray:",
		image_lung_xray,
		"\nimage_lung_ct: ",
		image_lung_ct,
		"\nimage_lung_petct: ",
		image_lung_petct,
	);
	console.log("\n\n\n");

	await predict(image_lung_xray, image_lung_ct, image_lung_petct);

	document.getElementById("notifications-container").style.display = "none";
	document.getElementById("upload-container").style.display = "none";
	document.getElementById("report-container").style.display = "block";
}

//#################################################################################
// ### PREDICTIONS
//#################################################################################
let fileName = null;
const slow_velocity = 500;

async function predict(image_lung_xray, image_lung_ct, image_lung_petct) {
	let modalities_uploaded = "";
	let text_lung_hnh = "";
	let text_lung_T = "";
	let text_lung_N = "";
	let text_lung_M = "";
	let text_location = "";
	let text_pneumonia = "";
	let text_clear_report = "";

	if (image_lung_xray !== null) {
		modalities_uploaded += "X-ray scan ";
		// _____________________  PREPROCESS THE IMAGES  ______________________
		// model lungcancer classification h/nh
		const tensor_lung_hnh = tf.browser
			.fromPixels(image_lung_xray)
			.resizeNearestNeighbor([128, 128]) // change the image size here
			.toFloat()
			.div(tf.scalar(255.0))
			.expandDims();
		console.log("input for lungcancer_hnh model: ", tensor_lung_hnh.shape);

		// model five diseases classification
		const tensor_lung_tnm = tf.browser
			.fromPixels(image_lung_xray)
			.resizeNearestNeighbor([224, 224]) // change the image size here
			.toFloat()
			.div(tf.scalar(255.0))
			.expandDims();
		console.log("input for lungcancer_tnm model: ", tensor_lung_tnm.shape);

		// model pneumonia classification
		const tensor_pneumonia = tf.browser
			.fromPixels(image_lung_xray)
			.resizeNearestNeighbor([200, 200]) // change the image size here
			.toFloat()
			.expandDims();
		console.log(tensor_pneumonia.shape);

		// model nature classification ---------->  PYTORCH MODEL
		//let tensor_nature = tf.browser.fromPixels(img_)
		//.resizeNearestNeighbor([150,150]) // change the image size here
		//.toFloat()
		//.div(tf.scalar(255.0))
		//.expandDims();
		//tensor_nature.shape.reverse();
		//tensor_nature = tf.squeeze(tensor_nature);
		//tensor_nature = tf.expandDims(tensor_nature);

		//console.log(tensor_nature.shape)

		document.getElementById("div-model-download-fraction").style.display =
			"none";
		document.getElementById("div-model-download-fraction").style.lineHeight =
			"0px";
		document.getElementById("div-model-download-fraction").style.height = "0px";

		// _____________________  PERFORM PREDICTIONS  ______________________
		const predictions_lung_hnh = await model_lung_hnh
			.predict(tensor_lung_hnh)
			.data(); //model lung healthy - non healthy predictions
		predictions_lung_hnh[1] = 1 - predictions_lung_hnh[0];
		//let predictions_nature = await model_nature.predict(tensor_nature).data(); //model nature classification

		// _____________________  DEFINE LABELS  ______________________
		const LABELS_lung_hnh = ["Healthy [H]", "Non Healthy [NH]"];
		let RESULTS_lung_hnh = Array.from(predictions_lung_hnh);
		RESULTS_lung_hnh = RESULTS_lung_hnh.map((each_element) =>
			Number(each_element.toFixed(3)),
		);
		console.log(`predictions lung healthy-non healthy:\n${RESULTS_lung_hnh}`);

		// _____________________  DEFINE SENTENCES  ______________________
		//Healthy - Non Healthy
		if (predictions_lung_hnh[0] > predictions_lung_hnh[1]) {
			// _____________________  DEFINE SENTENCES  ______________________
			text_lung_hnh =
				"The lungs appear to be healthy without any abnormal mass or nodule and also with no any oncological findings.";
			text_clear_report =
				"Overall, there is no evidence of an active disease and the lungs appear to be clear.";
		} else {
			text_lung_hnh =
				"The lungs appear to contain oncological findings for lung cancer with an abnormal mass or nodule.";

			if (image_lung_ct !== null) {
				modalities_uploaded += "CT scan";
				console.log("image_lung_ct: ", image_lung_ct);

				// _____________________  PERFORM PREDICTIONS  ______________________
				let predictions_lung_tnm = await model_lung_tnm
					.predict(tensor_lung_tnm)
					.data(); //model lung tnm staging predictions
				predictions_lung_tnm = [1, 1, 0]; //THIS IS AN EXAMPLE FOR DEMONSTRATION PURPOSES! TO BE DELETED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

				const predictions_pneumonia = await model_pneumonia
					.predict(tensor_pneumonia)
					.data(); //model pneumonia predictions
				predictions_pneumonia[1] = 1 - predictions_pneumonia[0];

				// _____________________  DEFINE LABELS  ______________________
				const LABELS_lung_tnm = [
					"Size [T]",
					"Nodes invasion [N]",
					"Metastasis [M]",
				];
				let RESULTS_lung_tnm = Array.from(predictions_lung_tnm); //i.e. const RESULTS = ["0", "0", "1"]
				RESULTS_lung_tnm = RESULTS_lung_tnm.map((each_element) =>
					Number(each_element.toFixed(3)),
				);
				console.log(`predictions TNM staging:\n${RESULTS_lung_tnm}`);

				const LABELS_pneumonia = ["Metastasis [M1]", "No Metastasis [M0]"];
				let RESULTS_pneumonia = Array.from(predictions_pneumonia);
				RESULTS_pneumonia = RESULTS_pneumonia.map((each_element) =>
					Number(each_element.toFixed(3)),
				);
				console.log(`predictions pneumonia:\n${RESULTS_pneumonia}`);

				// _____________________  DEFINE SENTENCES  ______________________
				//TNM staging
				//T size
				const predefined_sentences_T = [
					"Following the TNM staging system, the size of the tumour is T0.",
					"Following the TNM staging system, the size of the tumour is T1 3cm or smaller and contained within the lung.",
					"T2. ",
				];
				if (RESULTS_lung_tnm[0] <= 0.5) {
					text_lung_T += predefined_sentences_T[0];
				} else {
					text_lung_T += predefined_sentences_T[1];
				}
				//N nodes invasion
				const predefined_sentences_N = [
					"N0",
					"N1 There are cancer cells in lymph nodes within the lung or in lymph nodes in the area where the lungs join the airway (the hilum).",
					"N2 There is cancer in lymph nodes: in the centre of the chest (mediastinum) on the same side as the affected lung or just under where the windpipe branches off to each lung.",
				];
				if (RESULTS_lung_tnm[1] <= 0.5) {
					text_lung_N += predefined_sentences_N[0];
				} else {
					text_lung_N += predefined_sentences_N[1];
				}
				//M metastasis
				const predefined_sentences_M = [
					"Also, in terms of metastasis M0 the cancer has not spread to another lobe of the lung or any other part of the body.",
					"Also, in terms of metastasis M1 the cancer has spread to other areas of the body.",
				];
				if (RESULTS_lung_tnm[2] <= 0.5) {
					text_lung_M += predefined_sentences_M[0];
				} else {
					text_lung_M += predefined_sentences_M[1];
				}
				if (predictions_pneumonia[0] > predictions_pneumonia[1]) {
					text_pneumonia = "test111";
					found_a_disease = 1;
				} else {
					text_pneumonia = "test11";
				}

				$("#findings").fadeOut(slow_velocity, () => {
					$("#findings").hide();
					$("#findings").replaceWith(
						`<h3 id="findings" style="border-bottom: 1px solid #363634;">Findings</h3>`,
					);
					$("#findings").fadeIn(slow_velocity);
				});
				$("#gridrow1").fadeOut(slow_velocity, () => {
					$("#gridrow1").hide();
					$("#gridrow1").replaceWith(
						`<div class="gridrow" id="gridrow1" style="border-bottom: 1px solid #363634;"><li>${LABELS_lung_hnh[0]}</li><li>${LABELS_lung_hnh[1]}</li></div>`,
					);
					$("#gridrow1").fadeIn(slow_velocity);
				});
				$("#gridrow2").fadeOut(slow_velocity, () => {
					$("#gridrow2").hide();
					$("#gridrow2").replaceWith(
						`<div class="gridrow" id="gridrow2"><li>${RESULTS_lung_hnh[0]}</li><li>${RESULTS_lung_hnh[1]}</li></div>`,
					);
					$("#gridrow2").fadeIn(slow_velocity);
				});
				$("#gridrow3").fadeOut(slow_velocity, () => {
					$("#gridrow3").hide();
					$("#gridrow3").replaceWith(
						`<div class="gridrow" id="gridrow3" style="border-bottom: 1px solid #363634;"><li>${LABELS_lung_tnm[0]}</li><li>${LABELS_lung_tnm[1]}</li><li>${LABELS_lung_tnm[2]}</li></div>`,
					);
					$("#gridrow3").fadeIn(slow_velocity);
				});
				$("#gridrow4").fadeOut(slow_velocity, () => {
					$("#gridrow4").hide();
					$("#gridrow4").replaceWith(
						`<div class="gridrow" id="gridrow4"><li>T${RESULTS_lung_tnm[0]}</li><li>N${RESULTS_lung_tnm[1]}</li><li>M${RESULTS_lung_tnm[2]}</li></div>`,
					);
					$("#gridrow4").fadeIn(slow_velocity);
				});
				$("#gridrow5").fadeOut(slow_velocity, () => {
					$("#gridrow5").hide();
					$("#gridrow5").replaceWith(
						`<div class="gridrow" id="gridrow5" style="border-bottom: 1px solid #363634;"><li>${LABELS_pneumonia[0]}</li><li>${LABELS_pneumonia[1]}</li></div>`,
					);
					$("#gridrow5").fadeIn(slow_velocity);
				});
				$("#gridrow6").fadeOut(slow_velocity, () => {
					$("#gridrow6").hide();
					$("#gridrow6").replaceWith(
						`<div class="gridrow" id="gridrow6"><li>${RESULTS_pneumonia[0]}</li><li>${RESULTS_pneumonia[1]}</li></div>`,
					);
					$("#gridrow6").fadeIn(slow_velocity);
				});

				//Location
				const HEIGHT = 128;
				const WIDTH = 128;

				const image_lung_ct_tensor = tf.browser
					.fromPixels(image_lung_ct)
					.resizeNearestNeighbor([HEIGHT, WIDTH])
					.toFloat();
				console.log("image_lung_ct_tensor: "); //image_lung_ct_tensor.print()
				console.log("image_lung_ct_tensor shape: ", image_lung_ct_tensor.shape);
				const image_lung_ct_array = await image_lung_ct_tensor.array();

				const interested_in_color_low_bound = [250, 250, 250]; // RGB code of ROI color!!!
				const interested_in_color_up_bound = [255, 255, 255]; // RGB code of ROI color!!!
				const all_pixels = HEIGHT * WIDTH;
				let roi_pixels = 0;
				let x_min = WIDTH - 1;
				let x_max = 0;
				let y_min = HEIGHT - 1;
				let y_max = 0;
				for (let y = 0; y < image_lung_ct_array.length; y++) {
					for (let x = 0; x < image_lung_ct_array[y].length; x++) {
						if (
							between(
								image_lung_ct_array[y][x][0],
								interested_in_color_low_bound[0],
								interested_in_color_up_bound[0],
							) &&
							between(
								image_lung_ct_array[y][x][1],
								interested_in_color_low_bound[1],
								interested_in_color_up_bound[1],
							) &&
							between(
								image_lung_ct_array[y][x][2],
								interested_in_color_low_bound[2],
								interested_in_color_up_bound[2],
							)
						) {
							roi_pixels += 1;
							if (x < x_min) {
								x_min = x;
							}
							if (x > x_max) {
								x_max = x;
							}
							if (y < y_min) {
								y_min = y;
							}
							if (y > y_max) {
								y_max = y;
							}
						}
					}
				}
				console.log("prediction location: ");
				console.log("all_pixels: ", all_pixels);
				console.log("roi_pixels: ", roi_pixels);
				if (x_min <= x_max && y_min <= y_max) {
					const x_centerROI = (x_min + x_max) / 2;
					const y_centerROI = (y_min + y_max) / 2;
					console.log(
						"The ROI region of the tumor can be found between:  ",
						"\n x-axis:",
						x_min,
						"-",
						x_max,
						"\n y-axis:",
						y_min,
						"-",
						y_max,
					);
					console.log(
						"The center of ROI region is concentrated at: \n x-axis: ",
						x_centerROI,
						"\n y-axis: ",
						y_centerROI,
					);
					if (y_centerROI >= 0 && y_centerROI < HEIGHT / 3) {
						text_location +=
							"The location where the cancer is concentrated is at the upper lobe ";
					}
					if (y_centerROI >= HEIGHT / 3 && y_centerROI <= (HEIGHT / 3) * 2) {
						text_location +=
							"The location where the cancer is concentrated is at the middle lobe ";
					}
					if (y_centerROI > (HEIGHT / 3) * 2 && y_centerROI <= HEIGHT) {
						text_location +=
							"The location where the cancer is concentrated is at the lower lobe ";
					}
					if (x_centerROI >= 0 && x_centerROI < WIDTH / 2) {
						text_location += "of the left lung.";
					}
					if (x_centerROI >= WIDTH / 2 && x_centerROI <= WIDTH) {
						text_location += "of the right lung.";
					}
				}
			}

			if (image_lung_petct !== null) {
				modalities_uploaded += "PET/CT scan ";
				if (image_lung_ct == null) {
					const HEIGHT = 128;
					const WIDTH = 128;

					const image_lung_petct_tensor = tf.browser
						.fromPixels(image_lung_petct)
						.resizeNearestNeighbor([HEIGHT, WIDTH])
						.toFloat();
					console.log("image_lung_petct_tensor: "); //image_lung_petct_tensor.print()
					console.log(
						"image_lung_petct_tensor shape: ",
						image_lung_petct_tensor.shape,
					);
					const image_lung_petct_array = await image_lung_petct_tensor.array();

					const interested_in_color_low_bound = [250, 250, 250]; // RGB code of ROI color!!!
					const interested_in_color_up_bound = [255, 255, 255]; // RGB code of ROI color!!!
					const all_pixels = HEIGHT * WIDTH;
					let roi_pixels = 0;
					let x_min = WIDTH - 1;
					let x_max = 0;
					let y_min = HEIGHT - 1;
					let y_max = 0;
					for (let y = 0; y < image_lung_petct_array.length; y++) {
						for (let x = 0; x < image_lung_petct_array[y].length; x++) {
							if (
								between(
									image_lung_petct_array[y][x][0],
									interested_in_color_low_bound[0],
									interested_in_color_up_bound[0],
								) &&
								between(
									image_lung_petct_array[y][x][1],
									interested_in_color_low_bound[1],
									interested_in_color_up_bound[1],
								) &&
								between(
									image_lung_petct_array[y][x][2],
									interested_in_color_low_bound[2],
									interested_in_color_up_bound[2],
								)
							) {
								roi_pixels += 1;
								if (x < x_min) {
									x_min = x;
								}
								if (x > x_max) {
									x_max = x;
								}
								if (y < y_min) {
									y_min = y;
								}
								if (y > y_max) {
									y_max = y;
								}
							}
						}
					}
					console.log("prediction location: ");
					console.log("all_pixels: ", all_pixels);
					console.log("roi_pixels: ", roi_pixels);
					if (x_min <= x_max && y_min <= y_max) {
						const x_centerROI = (x_min + x_max) / 2;
						const y_centerROI = (y_min + y_max) / 2;
						console.log(
							"The ROI region of the tumor can be found between:  ",
							"\n x-axis:",
							x_min,
							"-",
							x_max,
							"\n y-axis:",
							y_min,
							"-",
							y_max,
						);
						console.log(
							"The center of ROI region is concentrated at: \n x-axis: ",
							x_centerROI,
							"\n y-axis: ",
							y_centerROI,
						);
						if (y_centerROI >= 0 && y_centerROI < HEIGHT / 3) {
							text_location +=
								"The location where the cancer is concentrated is at the upper lobe ";
						}
						if (y_centerROI >= HEIGHT / 3 && y_centerROI <= (HEIGHT / 3) * 2) {
							text_location +=
								"The location where the cancer is concentrated is at the middle lobe ";
						}
						if (y_centerROI > (HEIGHT / 3) * 2 && y_centerROI <= HEIGHT) {
							text_location +=
								"The location where the cancer is concentrated is at the lower lobe ";
						}
						if (x_centerROI >= 0 && x_centerROI < WIDTH / 2) {
							text_location += "of the left lung.";
						}
						if (x_centerROI >= WIDTH / 2 && x_centerROI <= WIDTH) {
							text_location += "of the right lung.";
						}
					}
				}
			}
			if (image_lung_ct == null && image_lung_petct == null) {
				text_lung_hnh +=
					" A CT scan or a PET/CT scan is suggested for more detailed diagnostic report.";
			}
		}

		// _____________________  FINAL CONSTRUCTION OF LUNG REPORT  ______________________
		// Clear the previous session and display the results of medical report
		$("#summary_title").fadeOut(slow_velocity, () => {
			$("#summary_title").hide();
			$("#summary_title").replaceWith(
				`<p id="summary_title">Medical Report Summary</p>`,
			);
			$("#summary_title").fadeIn(slow_velocity);
		});

		$("#image_name").fadeOut(slow_velocity, () => {
			$("#image_name").hide();
			$("#image_name").replaceWith(
				`<h1 id="image_name">Uploaded Scan: ${fileName} </h1>`,
			);
			$("#image_name").fadeIn(slow_velocity);
		});
		$("#image_modality").fadeOut(slow_velocity, () => {
			$("#image_modality").hide();
			const todayDate = new Date().toISOString().slice(0, 10);
			$("#image_modality").replaceWith(
				`<h2>Imaging Modality: ${modalities_uploaded} &nbsp; Location: Chest/Thorax &nbsp; Date: ${todayDate}</h2>`,
			);
			$("#image_modality").fadeIn(slow_velocity);
		});

		$("#prediction_list").fadeOut(slow_velocity, () => {
			$("#prediction_list").hide();
			$("#prediction_list").replaceWith(
				`<h4 id='prediction_list'>The diagnostic report for the patient of the scan "${fileName}", summarizing the uploaded exams and conclusions that arise from the AI models, suggests the following. ${text_lung_hnh} ${text_location} ${text_lung_T} ${text_lung_N} ${text_lung_M} ${text_clear_report}</h4>`,
			);
			$("#prediction_list").fadeIn(slow_velocity);
		});
	}

	//document.getElementById('testCanvas').getContext('2d').canvas.width = img_.width;
	//document.getElementById('testCanvas').getContext('2d').canvas.height = img_.height;
	//document.getElementById('testCanvas').getContext('2d').drawImage(img_, 0, 0, img_.width, img_.height);

	//export button visible
	$(".export_button").fadeIn(slow_velocity);
	//text editable button visible
	$(".textedit_button").fadeIn(slow_velocity);
}

//#################################################################################
// ### MAKE REPORT TEXT EDITABLE
//#################################################################################
async function MakeTextEditable() {
	$("#prediction_list").css("color", "#BABABA");
	setTimeout(() => {
		MakeTextEditableMechanism();
	}, 400);
}

async function MakeTextEditableMechanism() {
	console.log("Manual report edit");
	$("#prediction_list").css("color", "#363634");

	let post = $("#prediction_list").clone();
	post.find("span:not(.post_tag):not(.post_mentioned)").remove();
	post = $.trim(post.text());

	console.log("Characters count: ", post.length);
	//make the text editable
	$("#prediction_list").attr("contenteditable", "true");
	//change the cursor style
	document.getElementById("prediction_list").style.cursor = "text";

	input = document.querySelector("#prediction_list");
	settings = {
		maxLen: 430,
	};
	keys = {
		backspace: 8,
		shift: 16,
		ctrl: 17,
		alt: 18,
		delete: 46,
		leftArrow: 37,
		upArrow: 38,
		rightArrow: 39,
		downArrow: 40,
	};
	utils = {
		special: {},
		navigational: {},
		isSpecial(e) {
			return typeof this.special[e.keyCode] !== "undefined";
		},
		isNavigational(e) {
			return typeof this.navigational[e.keyCode] !== "undefined";
		},
	};
	utils.special[keys.backspace] = true;
	utils.special[keys.shift] = true;
	utils.special[keys.ctrl] = true;
	utils.special[keys.alt] = true;
	utils.special[keys.delete] = true;
	utils.navigational[keys.upArrow] = true;
	utils.navigational[keys.downArrow] = true;
	utils.navigational[keys.leftArrow] = true;
	utils.navigational[keys.rightArrow] = true;

	input.addEventListener("keydown", (event) => {
		const len = event.target.innerText.trim().length;
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
	const iframe = document.createElement("iframe");
	iframe.setAttribute("id", "iframe");
	iframe.style.width = "1380px";
	iframe.style.height = "100%";
	iframe.style.visibility = "hidden";

	document.body.appendChild(iframe);
	const html = document.documentElement.outerHTML;
	iframe.srcdoc = html;
	iframe.addEventListener("load", () => {
		html2canvas(iframe.contentWindow.document.getElementById("content"), {
			background: "#fff",
		}).then((canvas) => {
			//let link = document.createElement("a");
			//link.download = "Medical_Report.jpg";
			//canvas.toBlob( function(blob) {
			//	link.href = URL.createObjectURL(blob);
			//	link.click();
			//}, 'image/jpg');
			//document.body.appendChild(canvas);
			const imgData = canvas.toDataURL("image/png", 1.0);
			const pdf = new jsPDF("l", "px", [742, 480]);
			pdf.addImage(imgData, "PNG", 0, 0, 742, 480);
			pdf.save("report_export.pdf");
			$("#iframe").replaceWith("");
		});
	});
	console.log("PDF exported");
}

function between(x, min, max) {
	return x >= min && x <= max;
}

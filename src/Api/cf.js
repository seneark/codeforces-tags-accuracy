import axios from "axios";

function getRandomColor() {
	var color = "rgba(";
	for (var i = 0; i < 3; i++) {
		color += Math.floor(Math.random() * 255).toString();
		color += ", ";
	}
	color += "0.3 )";
	return color;
}

function get_accuracy_obj_for_CharJS(obj, threshold = 0) {
	let finalObj = {};
	finalObj.labels = [];
	finalObj.datasets = [];
	let sorted_tags = Object.entries(obj).sort(
		(a, b) =>
			a[1].pass / (a[1].pass + a[1].wrong) -
			b[1].pass / (b[1].pass + b[1].wrong)
	);
	let accuracy = [];
	let backgroundColor = [];
	for (let i = 0; i < sorted_tags.length; i++) {
		let correct_count = sorted_tags[i][1].pass;
		let wrong_count = sorted_tags[i][1].wrong;
		if (correct_count + wrong_count >= threshold) {
			finalObj.labels.push(
				sorted_tags[i][0] +
					" " +
					(correct_count + wrong_count).toString()
			);
			accuracy.push(
				(correct_count / (correct_count + wrong_count)) * 100
			);
			backgroundColor.push(getRandomColor());
		}
	}
	let data_obj = {};
	data_obj.data = accuracy;
	data_obj.backgroundColor = backgroundColor;
	data_obj.borderWidth = 1;
	finalObj.datasets.push(data_obj);
	console.log(finalObj);
	return finalObj;
}

export async function get_questions_user(user) {
	const data = await axios
		.get(
			"https://codeforces.com/api/user.status?handle=" +
				user +
				"&from=1&count=100000000"
		)
		.then((response) => {
			return response.data;
		});
	return data;
}

export function get_tags_accuracy(data, threshold = 0) {
	let obj = {};
	let tags_obj = {};
	tags_obj.labels = [];
	tags_obj.datasets = [];

	for (let i = 0; i < data.length; i++) {
		let verdict = data[i].verdict === "OK" ? 1 : 0;
		data[i].problem.tags.map((data) => {
			if (!(data in obj)) {
				obj[data] = {};
				obj[data].pass = 0;
				obj[data].wrong = 0;
			}
			if (verdict === 1) {
				obj[data].pass += 1;
			} else {
				obj[data].wrong += 1;
			}
		});
	}

	let sorted_tags = Object.entries(obj).sort(
		(a, b) =>
			a[1].pass / (a[1].pass + a[1].wrong) -
			b[1].pass / (b[1].pass + b[1].wrong)
	);
	let accuracy = [];
	let backgroundColor = [];
	for (let i = 0; i < sorted_tags.length; i++) {
		let correct_count = sorted_tags[i][1].pass;
		let wrong_count = sorted_tags[i][1].wrong;
		if (correct_count + wrong_count >= threshold) {
			tags_obj.labels.push(
				sorted_tags[i][0] +
					" " +
					(correct_count + wrong_count).toString()
			);
			accuracy.push(
				(correct_count / (correct_count + wrong_count)) * 100
			);
			backgroundColor.push(getRandomColor());
		}
	}
	let data_obj = {};
	data_obj.data = accuracy;
	data_obj.backgroundColor = backgroundColor;
	data_obj.borderWidth = 1;
	tags_obj.datasets.push(data_obj);
	console.log(tags_obj);
	return tags_obj;
}

export function get_questions_accuracy(data, threshold = 0) {
	let obj = {};
	let tags_obj = {};
	tags_obj.labels = [];
	tags_obj.datasets = [];

	for (let i = 0; i < data.length; i++) {
		let verdict = data[i].verdict === "OK" ? 1 : 0;
		let question = data[i].problem.index;
		if (!(question in obj)) {
			obj[question] = {};
			obj[question].pass = 0;
			obj[question].wrong = 0;
		}
		if (verdict === 1) {
			obj[question].pass += 1;
		} else {
			obj[question].wrong += 1;
		}
	}
	console.log("obj", obj);
	return get_accuracy_obj_for_CharJS(obj, threshold);
}

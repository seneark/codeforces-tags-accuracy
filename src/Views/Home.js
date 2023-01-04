import React, { useState } from "react";
import { Container, Input, Text } from "@nextui-org/react";
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	RadialLinearScale,
	Title,
	PointElement,
	LineElement,
	Filler,
	Legend,
} from "chart.js";
import { Pie, Doughnut, PolarArea, Radar } from "react-chartjs-2";

import {
	get_questions_user,
	get_tags_accuracy,
	get_questions_accuracy,
} from "../Api/cf";

ChartJS.register(
	ArcElement,
	Tooltip,
	RadialLinearScale,
	Title,
	PointElement,
	LineElement,
	Filler
);

const Home = () => {
	const [username, setUsername] = useState("");
	const [show, setShow] = useState(false);
	const [data, setData] = useState("");
	const [tagsInfo, setTagsInfo] = useState([]);
	const [ratingInfo, setRatingInfo] = useState([]);

	const _handleSubmit = async (event) => {
		event.preventDefault();

		get_questions_user(username).then((data) => {
			console.log(data);
			setData(data);
			setShow(true);
			setTagsInfo(get_tags_accuracy(data.result, 10));
			setRatingInfo(get_questions_accuracy(data.result, 10));
		});
	};
	return (
		<Container
			style={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
			}}
		>
			<h1>Wrong Solution %</h1>
			<br />
			<form onSubmit={_handleSubmit}>
				<Input
					clearable
					size="xl"
					color="secondary"
					width="500px"
					labelPlaceholder="Username"
					value={username}
					onChange={(e) => {
						setUsername(e.target.value);
					}}
				/>
			</form>
			<br />
			{show === true ? (
				<Container
					style={{
						height: "50vh",
						display: "flex",
						justifyContent: "center",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<PolarArea
						data={tagsInfo}
						options={{
							responsive: true,
							plugins: {
								title: {
									display: true,
									text: "Codeforces tag accuracy",
								},
							},
						}}
					></PolarArea>
					<Radar
						data={ratingInfo}
						options={{
							plugins: {
								title: {
									display: true,
									text: "Codeforces question accuracy",
								},
							},
						}}
					/>
				</Container>
			) : (
				<Text>Enter your username</Text>
			)}
		</Container>
	);
};

export default Home;

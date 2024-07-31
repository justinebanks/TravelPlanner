import "../styles/topbar.css";

interface Props {
	title: string;
	buttonText: string;
	buttonColor: "red" | "green";
	buttonAction: (event: React.MouseEvent) => void;
}

export default function TopBar({
	title,
	buttonText,
	buttonColor,
	buttonAction,
}: Props) {
	return (
		<div className="top-bar">
			<h1>{title}</h1>
			<button className={buttonColor} onClick={buttonAction}>
				{buttonText}
			</button>
		</div>
	);
}

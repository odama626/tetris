import * as React from 'react';

import * as style from './Grid.scss';

interface Props {
	data: any[];
	filter?: string[];
	headerMap?: any;
	renderMap?: any;
}

export default class Grid extends React.Component<Props, {}> {


	render() {
		const { filter=[], data, headerMap = {}, renderMap = {}} = this.props;

		if (data.length < 1) {
			return null;
		}

		// Get keys from first object to create Header labels
		const headers = Object.keys(data[0]).filter(d => filter.indexOf(d) < 0);

		// Replace Header text when provided from headerMap
		const formalHeaders = {...headers.map(header => ({[header]: header[0].toUpperCase()+header.slice(1)})).reduce((a, c) => ({...a, ...c}), {}), ...headerMap}

		// Replace Items with custom function when render function is provided for key
		const renderer = {...headers.map(header => ({[header]: d => d})).reduce((a, c) => ({...a, ...c}), {}), ...renderMap}

		return (
			<div className={style.container}>
				<table>
					<thead><tr>{headers.map((h, i) => <th key={i}>{formalHeaders[h]}</th>)}</tr></thead>
					<tbody>
						{data.map((d, i) =>
							<tr key={i}>{headers.map((h, k) =>
								<td key={k}>{renderer[h](d[h])}</td>
							)}</tr>
						)}
					</tbody>
				</table>
			</div>
		)
	}
}
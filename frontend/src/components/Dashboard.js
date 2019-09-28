import React, { useState } from 'react';
import Column from './Columns';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

const Dashboard = () => {
	const [ tasks, setTasks ] = useState({
		task1: {
			id: 'task1',
			content: 'content1'
		},
		task2: {
			id: 'task2',
			content: 'content2'
		},
		task3: {
			id: 'task3',
			content: 'content3'
		},
		task4: {
			id: 'task4',
			content: 'content4'
		},
		task5: {
			id: 'task5',
			content: 'content5'
		},
		task6: {
			id: 'task6',
			content: 'content6'
		}
	});

	const [ columns, setColumns ] = useState({
		column1: {
			id: 'column1',
			title: 'To Do',
			taskIds: [ 'task1', 'task2', 'task3', 'task4', 'task5', 'task6' ]
		},
		column2: {
			id: 'column2',
			title: 'InProgress',
			taskIds: []
		}
	});

	const [ columnOrder, setColumnOrder ] = useState([ 'column1', 'column2' ]);

	const Container = styled.div`
		margin: 8px;
		border-radius: 2px;
		width: 200px;
		display: flex;
		flex-direction: row;
	`;
	const onDragEnd = (result) => {
		const { source, destination, draggableId, type } = result;
		// if there is no destination
		if (!destination) {
			return;
		}
		// if the drag start and end in same place
		if (source.droppableId === destination.droppableId && source.index === destination.index) {
			return;
		}

		console.log(result);
		if (type === 'column') {
			const newColumnOrder = Array.from(columnOrder);
			newColumnOrder.splice(source.index, 1);
			newColumnOrder.splice(destination.index, 0, draggableId);
			setColumnOrder(newColumnOrder);
			return;
		}

		const start = columns[source.droppableId];
		const finish = columns[destination.droppableId];

		// For drag between a single column
		if (start === finish) {
			// creating a new column
			const column = columns[source.droppableId];
			// creating new taskIds
			const newTaskIds = column.taskIds;
			newTaskIds.splice(source.index, 1);
			newTaskIds.splice(destination.index, 0, draggableId);
			// creating new Column to avoid mutation
			// changing a single column to persist all the remaining properties
			const newColumn = {
				...column,
				taskIds: newTaskIds
			};
			// replacing the new column in the state
			setColumns({
				...columns,
				[newColumn.id]: newColumn
			});
			return;
		}

		// For drag and drop between multiple columns
		const newStartTaskIds = Array.from(start.taskIds);
		newStartTaskIds.splice(source.index, 1);
		const newStart = {
			...start,
			taskIds: newStartTaskIds
		};

		const newFinishTaskIds = Array.from(finish.taskIds);
		newFinishTaskIds.splice(destination.index, 0, draggableId);
		const newFinish = {
			...finish,
			taskIds: newFinishTaskIds
		};

		setColumns({ ...columns, [newStart.id]: newStart, [newFinish.id]: newFinish });
		return;
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId={'droppable'} direction="horizontal" type="column">
				{(provided) => {
					return (
						<Container {...provided.droppableProps} ref={provided.innerRef}>
							{columnOrder.map((columnId, index) => {
								const column = columns[columnId];
								const task = column.taskIds.map((taskIds) => tasks[taskIds]);
								return <Column key={index.toString()} column={column} tasks={task} index={index} />;
							})}{' '}
							{provided.placeholder}
						</Container>
					);
				}}
			</Droppable>
		</DragDropContext>
	);
};

export default Dashboard;

const fs = require('fs');
const prompt = require('prompt-sync')();

let tasks = [];

function loadTasks() {
    const data = fs.readFileSync('tasks.json', 'utf8');

    if (data) {
        tasks = JSON.parse(data);
    } else {
        tasks = [];
    }
}

function saveTasks() {
    const data = JSON.stringify(tasks);
    fs.writeFileSync('tasks.json', data);
}

function help() {
    console.log('Simple Pesonal Task Management.');
    console.log('Available commands:');
    console.log('add_task(<task name>, <date>, <time>)');
    console.log('list_tasks()');
    console.log('find_task(<partial name>)');
    console.log('remove_task(<task index>)');
    console.log('help()');
    console.log('exit()');
}

function addTasks(name, date, time) {
    const task = { name, date, time };
    tasks.push(task);
    console.log(`Task "${name}" added successfully.`);

    saveTasks();
}

function listTasks() {
    tasks.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA - dateB;
    });

    tasks.forEach((task, index) => {
        console.log(`${index + 1}. ${task.name} on ${task.date} at ${task.time}`)
    });
}

function findTask(partialName) {
    let matchingTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(partialName.toLowerCase()));

    console.log(`Found ${matchingTasks.length} task(s):`);

    matchingTasks.forEach(task => {
        console.log(`${task.name} - ${task.date} ${task.time}`);
    });
}

function removeTask(index) {
    if (index >= 0 && index < tasks.length) {
        const removedTask = tasks[index].name;
        tasks.splice(index, 1);

        saveTasks();

        console.log(`Task ${removedTask} removed successfully.`);
    } else {
        console.log('Invalid task index.');
    }
}

loadTasks();

while (true) {
    const input = prompt('Enter a command or help() for available commands:');
    const command = input.split('(')[0].trim();
    const args = input.slice(input.indexOf('(') + 1, -1).split(',').map(arg => arg.trim());

    switch (command) {
        case 'add_task':
            addTasks(args[0], args[1], args[2]);
            break;
        case 'help':
            help();
            break;
        case 'list_tasks':
            listTasks();
            break;
        case 'find_task':
            findTask(args[0])
            break;
        case 'remove_task':
            removeTask(Number(args[0]) -1);
            break;
        case 'exit':
            console.log('Bye!')
            process.exit();
        default:
            console.log(`Command ${command} not found!`);
    }
}

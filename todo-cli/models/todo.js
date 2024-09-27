'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      // Fetch and display overdue tasks
      console.log("Overdue");
      const overdueTasks = await Todo.overdue();
      overdueTasks.forEach(task => {
        console.log(task.displayableString());
      });
      console.log("\n");

      // Fetch and display tasks due today
      console.log("Due Today");
      const todayTasks = await Todo.dueToday();
      todayTasks.forEach(task => {
        console.log(task.displayableString());
      });
      console.log("\n");

      // Fetch and display tasks due later
      console.log("Due Later");
      const laterTasks = await Todo.dueLater();
      laterTasks.forEach(task => {
        console.log(task.displayableString());
      });
    }

    static async overdue() {
      const today = new Date().toISOString().split('T')[0];
      const allTasks = await Todo.findAll({ where: { completed: false } });
      return allTasks.filter(task => task.dueDate < today);
    }

    static async dueToday() {
      const today = new Date().toISOString().split('T')[0];
      const allTasks = await Todo.findAll();
      return allTasks.filter(task => task.dueDate === today);
    }

    static async dueLater() {
      const today = new Date().toISOString().split('T')[0];
      const allTasks = await Todo.findAll();
      return allTasks.filter(task => task.dueDate > today);
    }

    static async markAsComplete(id) {
      const task = await Todo.findByPk(id);
      if (task) {
        task.completed = true;
        await task.save();
      }
    }
    displayableString() {
      const today = new Date().toISOString().split('T')[0];
      const checkbox = this.completed ? "[x]" : "[ ]";
    
      // Case: Completed task due today, hide the date
      if (this.dueDate === today && this.completed) {
        return `${this.id}. ${checkbox} ${this.title}`;
      }
    
      // Case: Incomplete task due today, hide the date
      if (this.dueDate === today && !this.completed) {
        return `${this.id}. ${checkbox} ${this.title}`;
      }
    
      // Case: Completed task overdue, show the due date
      if (this.dueDate < today && !this.completed) {
        return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
      }
    
      // Default case: Future tasks (completed or not) show due date
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }
    
    
  }

  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });

  return Todo;
};

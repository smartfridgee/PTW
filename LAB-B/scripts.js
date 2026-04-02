class Todo {
  static tasks = []
  static filter = ''

  static Add() {
    const name = document.getElementById('new_item_input').value
    const date = document.getElementById('new_item_date').value

    console.log(name, date)

    if (name.length < 3 || name.length > 255) {
      alert('Nazwa musi mieć co najmniej 3 znaki i nie więcej niż 255 znaków.')
      return
    }

    if (date < new Date().toISOString().split('T')[0] && date !== '') {
      alert('Data musi być dzisiejsza lub przyszła.')
      return
    }

    const task = {
      name: name,
      date: date
    }

    this.tasks.push(task)
    this.Draw()
    this.saveToLocalStorage()
  }

  static Remove(id) {
    this.tasks.splice(id, 1)
    this.Draw()
    this.saveToLocalStorage()
  }

  static saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks))
  }

  static loadFromLocalStorage() {
    const tasks = localStorage.getItem('tasks')
    if (tasks) {
      this.tasks = JSON.parse(tasks)
      this.Draw()
    }
  }

  static EditName(event, id) {
    const value = event.target.innerText
    const input = document.createElement('input')
    input.type = 'text'
    input.value = value
    event.currentTarget.replaceWith(input)
    input.focus()

      input.addEventListener('blur', () => {
        const newValue = input.value

        if (newValue.length < 3 || newValue.length > 255) {
          alert('Nazwa musi mieć co najmniej 3 znaki i nie więcej niż 255 znaków.')
          this.Draw()
          return
        }

        this.tasks[id].name = newValue
        this.Draw()
        this.saveToLocalStorage()
      })
  }

  static EditDate(event, id) {
    const value = event.target.innerText
    const input = document.createElement('input')
    input.type = 'date'
    input.value = value
    event.currentTarget.replaceWith(input)
    input.focus()

      input.addEventListener('blur', () => {
        const newValue = input.value

        if (newValue < new Date().toISOString().split('T')[0] && newValue !== '') {
          alert('Data musi być dzisiejsza lub przyszła.')
          this.Draw()
          return
        }

        this.tasks[id].date = newValue
        this.Draw()
        this.saveToLocalStorage()
      })
  }

  static Draw() {
    const items = document.getElementById('items')

    items.replaceChildren()

    const tasks_filtered = this.filter.length > 1 ? this.tasks.filter(task => task.name.includes(this.filter)) : this.tasks

    tasks_filtered.forEach((task, index) => {
      const item = document.createElement('li')
      item.classList.add('item')
      item.classList.add('grid')
      item.setAttribute('id', index.toString())
      item.innerHTML = `
        <span class="item_name" onclick="document.todo.EditName(event, ${index})">
          ${task.name.replaceAll(this.filter, `<mark>${this.filter}</mark>`)}
        </span>
        <span class="item_date" onclick="document.todo.EditDate(event, ${index})">${task.date}</span>
        <button class="remove" onclick="document.todo.Remove(${index})">Remove</button>
      `
      items.appendChild(item)
    })
  }
}

document.todo = Todo
Todo.loadFromLocalStorage()
import { useState, useEffect } from 'react'
import './App.css'

const STORAGE_KEY = "backlog-items"

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "The Bear", type: "TV Show", time: "medium", energy: "low", status: "backlog", rating: null },
      { id: 2, title: "Baldur's Gate 3", type: "Game", time: "long", energy: "high", status: "backlog", rating: null },
      { id: 3, title: "Project Hail Mary", type: "Book", time: "long", energy: "medium", status: "backlog", rating: null },
      { id: 4, title: "Bluey", type: "TV Show", time: "short", energy: "low", status: "backlog", rating: null },
    ]
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const [newTitle, setNewTitle] = useState("")
  const [newType, setNewType] = useState("TV Show")
  const [newTime, setNewTime] = useState("medium")
  const [newEnergy, setNewEnergy] = useState("medium")

  const [timeFilter, setTimeFilter] = useState("any")
  const [energyFilter, setEnergyFilter] = useState("any")

  const [suggestion, setSuggestion] = useState(null)

  function addItem() {
    if (newTitle.trim() === "") return

    const newItem = {
      id: Date.now(),
      title: newTitle,
      type: newType,
      time: newTime,
      energy: newEnergy,
      status: "backlog",
      rating: null,
    }

    setItems([...items, newItem])
    setNewTitle("")
    setNewType("TV Show")
    setNewTime("medium")
    setNewEnergy("medium")
  }

  function deleteItem(idToDelete) {
    setItems(items.filter((item) => item.id !== idToDelete))
  }

  function markDone(idToUpdate) {
    const ratingInput = prompt("Rate it 1-5:")
    const rating = parseInt(ratingInput, 10)
    if (!rating || rating < 1 || rating > 5) return

    setItems(items.map((item) =>
      item.id === idToUpdate ? { ...item, status: "done", rating } : item
    ))
  }

  const backlogItems = items.filter((item) => item.status === "backlog")
  const doneItems = items.filter((item) => item.status === "done")

  const filteredBacklog = backlogItems.filter((item) => {
    const timeMatches = timeFilter === "any" || item.time === timeFilter
    const energyMatches = energyFilter === "any" || item.energy === energyFilter
    return timeMatches && energyMatches
  })

  function averageRatingByType() {
    const typeRatings = {}
    doneItems.forEach((item) => {
      if (!typeRatings[item.type]) typeRatings[item.type] = []
      typeRatings[item.type].push(item.rating)
    })

    const averages = {}
    for (const type in typeRatings) {
      const ratings = typeRatings[type]
      averages[type] = ratings.reduce((sum, r) => sum + r, 0) / ratings.length
    }
    return averages
  }

  function surpriseMe() {
    if (filteredBacklog.length === 0) {
      setSuggestion(null)
      return
    }

    const averages = averageRatingByType()
    let bestType = null
    let bestAvg = 0
    for (const type in averages) {
      if (averages[type] > bestAvg) {
        bestAvg = averages[type]
        bestType = type
      }
    }

    const preferred = filteredBacklog.filter((item) => item.type === bestType)
    const pool = preferred.length > 0 ? preferred : filteredBacklog

    const randomPick = pool[Math.floor(Math.random() * pool.length)]
    setSuggestion(randomPick)
  }

  return (
    <div>
      <h1>My Backlog</h1>

      <div>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add something..."
        />

        <select value={newType} onChange={(e) => setNewType(e.target.value)}>
          <option value="TV Show">TV Show</option>
          <option value="Film">Film</option>
          <option value="Game">Game</option>
          <option value="Book">Book</option>
        </select>

        <select value={newTime} onChange={(e) => setNewTime(e.target.value)}>
          <option value="short">Short time</option>
          <option value="medium">Medium time</option>
          <option value="long">Long time</option>
        </select>

        <select value={newEnergy} onChange={(e) => setNewEnergy(e.target.value)}>
          <option value="low">Low energy</option>
          <option value="medium">Medium energy</option>
          <option value="high">High energy</option>
        </select>

        <button onClick={addItem}>Add</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <label>
          Time available:{" "}
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <option value="any">Any</option>
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </label>

        <label style={{ marginLeft: "20px" }}>
          Energy level:{" "}
          <select value={energyFilter} onChange={(e) => setEnergyFilter(e.target.value)}>
            <option value="any">Any</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <button style={{ marginLeft: "20px" }} onClick={surpriseMe}>
           Surprise Me
        </button>
      </div>

      {suggestion && (
        <div style={{ border: "2px solid #444", padding: "10px", marginTop: "10px", maxWidth: "300px" }}>
          <strong>How about:</strong> {suggestion.title} ({suggestion.type})
          <br />
          <button onClick={surpriseMe}>Try again</button>
        </div>
      )}

      <h2 style={{ marginTop: "30px" }}>Backlog</h2>
      <ul>
        {filteredBacklog.map((item) => (
          <li key={item.id}>
            {item.title} — {item.type} ({item.time} time, {item.energy} energy)
            <button onClick={() => markDone(item.id)}>Mark Done</button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: "30px" }}>Completed</h2>
      <ul>
        {doneItems.map((item) => (
          <li key={item.id}>
            {item.title} — {item.type} — Rated {item.rating}/5
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
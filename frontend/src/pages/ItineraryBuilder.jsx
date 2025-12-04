import React, { useState, useEffect } from 'react';
import { itineraryAPI } from '../services/itineraryAPI';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import jsPDF from 'jspdf';

const ItineraryBuilder = () => {
  const [itineraries, setItineraries] = useState([]);
  const [current, setCurrent] = useState({ title: 'My Trip', days: [{ title: 'Day 1', places: [] }] });

  useEffect(() => {
    (async () => {
      const r = await itineraryAPI.list();
      setItineraries(r.data.data);
    })();
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    // simple single-list reorder for day places or day reorder - you can expand
    const day = current.days[0];
    const items = Array.from(day.places);
    const [moved] = items.splice(source.index, 1);
    items.splice(destination.index, 0, moved);
    const next = { ...current, days: [{ ...day, places: items }] };
    setCurrent(next);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(current.title, 20, 20);
    let y = 30;
    current.days.forEach((d,i) => {
      doc.setFontSize(14);
      doc.text(`${d.title}`, 20, y); y += 8;
      d.places.forEach(p => {
        doc.setFontSize(11);
        doc.text(`- ${p.name} (${p.city || p.location?.city || ''})`, 24, y); y += 6;
      });
      y += 6;
    });
    doc.save(`${current.title}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 overflow-x-hidden px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{current.title}</h1>
        <button onClick={exportPDF} className="bg-blue-600 text-white px-4 py-2 rounded">Export PDF</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        {current.days.map((day, idx) => (
          <div key={idx} className="mb-6 bg-white rounded p-4 shadow">
            <h2 className="font-semibold mb-2">{day.title}</h2>
            <Droppable droppableId={`day-${idx}`}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {day.places.map((p, i) => (
                    <Draggable key={p._id || i} draggableId={`p-${i}`} index={i}>
                      {(prov) => (
                        <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="p-3 border rounded mb-2">
                          <div className="font-medium">{p.name}</div>
                          <div className="text-sm text-gray-500">{p.city}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default ItineraryBuilder;

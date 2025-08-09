"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AuthButton } from "@/components/auth-button";
import { Calendar, Clock, MapPin, Users, Video, ExternalLink } from "lucide-react";
import { db } from "@/lib/supabase/queries";
import { useAuth } from "@/hooks/useAuth";
import type { EventWithOrganizer } from "@/lib/types/database";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers in react-leaflet (keeping for future use)
// const icon = L.icon({
//   iconUrl: '/marker-icon.png',
//   shadowUrl: '/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });

// Custom markers for different event types and status
const createEventIcon = (eventType: string, isLive: boolean = false, startingSoon: boolean = false) => {
  let color = '#3B82F6'; // Default blue
  
  if (isLive) color = '#EF4444'; // Red for live events
  else if (startingSoon) color = '#F59E0B'; // Yellow for starting soon
  else if (eventType === 'workshop') color = '#8B5CF6'; // Purple
  else if (eventType === 'meetup') color = '#10B981'; // Green
  else if (eventType === 'mentoring_session') color = '#F97316'; // Orange
  
  const svgIcon = `
    <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 11.3 15 25 15 25s15-13.7 15-25C30 6.7 23.3 0 15 0z" fill="${color}" stroke="white" stroke-width="2"/>
      ${isLive ? '<circle cx="15" cy="15" r="6" fill="white"/><circle cx="15" cy="15" r="3" fill="red"/>' : ''}
      ${startingSoon ? '<circle cx="15" cy="15" r="6" fill="white"/><text x="15" y="19" text-anchor="middle" fill="orange" font-size="12" font-weight="bold">⭐</text>' : ''}
      ${!isLive && !startingSoon ? '<circle cx="15" cy="15" r="6" fill="white"/>' : ''}
    </svg>
  `;
  
  return L.divIcon({
    html: svgIcon,
    className: 'custom-div-icon',
    iconSize: [30, 40],
    iconAnchor: [15, 40],
  });
};

export function MapPageContent() {
  const { user, isAuthenticated, redirectToSignIn } = useAuth();
  const [events, setEvents] = useState<EventWithOrganizer[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithOrganizer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventWithOrganizer | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const eventsData = await db.getEvents();
        setEvents(eventsData);
        setFilteredEvents(eventsData);
      } catch (err) {
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  // Filter events based on type and search term
  useEffect(() => {
    let filtered = events;
    
    if (filterType !== "all") {
      if (filterType === "live") {
        const now = new Date();
        filtered = filtered.filter(event => {
          const start = new Date(event.start_time);
          const end = new Date(event.end_time);
          return start <= now && end >= now;
        });
      } else if (filterType === "upcoming") {
        const now = new Date();
        filtered = filtered.filter(event => new Date(event.start_time) > now);
      } else {
        filtered = filtered.filter(event => event.event_type === filterType);
      }
    }
    
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredEvents(filtered);
  }, [events, filterType, searchTerm]);

  const getEventStatus = (event: EventWithOrganizer) => {
    const now = new Date();
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    
    if (start <= now && end >= now) {
      return { status: 'live', label: '🔴 LIVE NOW', color: 'bg-red-100 text-red-800 border border-red-200' };
    } else if (start.getTime() - now.getTime() < 30 * 60 * 1000 && start > now) { // 30 minutes
      return { status: 'soon', label: '🌟 Starting Soon', color: 'bg-yellow-100 text-yellow-800 border border-yellow-200' };
    } else if (start > now) {
      return { status: 'upcoming', label: 'Upcoming', color: 'bg-green-100 text-green-800 border border-green-200' };
    } else {
      return { status: 'ended', label: 'Ended', color: 'bg-gray-100 text-gray-800 border border-gray-200' };
    }
  };

  const formatEventTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRSVP = async (eventId: string, status: 'attending' | 'maybe' | 'not_attending') => {
    if (!isAuthenticated) {
      redirectToSignIn();
      return;
    }

    if (!user) return;

    try {
      await db.rsvpToEvent(eventId, user.id, status);
      // Update local state
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, user_rsvp_status: status, attendee_count: status === 'attending' ? event.attendee_count + 1 : event.attendee_count }
          : event
      ));
      alert(`RSVP'd ${status} to event!`);
    } catch (err) {
      console.error('Error RSVPing to event:', err);
      alert('Failed to RSVP. Please try again.');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <nav className="w-full bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">K</span>
              </div>
              Knit
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/search" className="text-gray-600 hover:text-yellow-500 transition-colors">
                Search
              </Link>
              <Link href="/communities" className="text-gray-600 hover:text-yellow-500 transition-colors">
                Communities
              </Link>
              <Link href="/map" className="text-yellow-600 font-semibold">
                Events
              </Link>
              <AuthButton />
            </div>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
            <p className="text-gray-500 text-lg">Loading events map...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <nav className="w-full bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-sm">K</span>
            </div>
            Knit
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/search" className="text-gray-600 hover:text-yellow-500 transition-colors">
              Search
            </Link>
            <Link href="/communities" className="text-gray-600 hover:text-yellow-500 transition-colors">
              Communities
            </Link>
            <Link href="/map" className="text-yellow-600 font-semibold">
              Events
            </Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Limerick Events</h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover intergenerational learning events happening around Limerick, Ireland
          </p>
          
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <Input
              placeholder="Search events, locations, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-white border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
            />
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className={filterType === "all" ? "bg-yellow-500 text-black" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}
              >
                All Events ({events.length})
              </Button>
              <Button
                variant={filterType === "live" ? "default" : "outline"} 
                onClick={() => setFilterType("live")}
                className={filterType === "live" ? "bg-red-500 text-white" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}
              >
                🔴 Live Now
              </Button>
              <Button
                variant={filterType === "upcoming" ? "default" : "outline"}
                onClick={() => setFilterType("upcoming")}
                className={filterType === "upcoming" ? "bg-green-500 text-white" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}
              >
                Upcoming
              </Button>
              <Button
                variant={filterType === "workshop" ? "default" : "outline"}
                onClick={() => setFilterType("workshop")}
                className={filterType === "workshop" ? "bg-purple-500 text-white" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}
              >
                Workshops
              </Button>
              <Button
                variant={filterType === "meetup" ? "default" : "outline"}
                onClick={() => setFilterType("meetup")}
                className={filterType === "meetup" ? "bg-blue-500 text-white" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}
              >
                Meetups
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-0">
                <div className="h-[600px] relative">
                  <MapContainer
                    center={[52.6638, -8.6267]} // Limerick, Ireland
                    zoom={12}
                    className="h-full w-full rounded-lg"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {filteredEvents.map(event => {
                      const status = getEventStatus(event);
                      const isLive = status.status === 'live';
                      const startingSoon = status.status === 'soon';
                      
                      return (
                        <Marker
                          key={event.id}
                          position={[event.latitude, event.longitude]}
                          icon={createEventIcon(event.event_type, isLive, startingSoon)}
                        >
                          <Popup maxWidth={300} className="event-popup">
                            <div className="p-2">
                              <div className="flex items-start justify-between mb-2">
                                <Badge className={`text-xs ${status.color}`}>
                                  {status.label}
                                </Badge>
                                <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                                  {event.event_type}
                                </Badge>
                              </div>
                              
                              <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                              
                              <div className="space-y-1 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatEventTime(event.start_time)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {event.attendee_count} attending
                                  {event.max_attendees && ` (${event.max_attendees} max)`}
                                </div>
                                {event.is_online && (
                                  <div className="flex items-center gap-1">
                                    <Video className="w-3 h-3" />
                                    Online Event
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedEvent(event)}
                                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black text-xs"
                                >
                                  View Details
                                </Button>
                                <Link href={`/events/${event.id}`}>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-xs px-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                                  >
                                    Full Page
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event List / Selected Event */}
          <div className="lg:col-span-1">
            {selectedEvent ? (
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedEvent(null)}
                      className="text-gray-500 hover:text-gray-700 p-0"
                    >
                      ← Back to list
                    </Button>
                    <Badge className={`text-xs ${getEventStatus(selectedEvent).color}`}>
                      {getEventStatus(selectedEvent).label}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{selectedEvent.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">{selectedEvent.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{formatEventTime(selectedEvent.start_time)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        {Math.round((new Date(selectedEvent.end_time).getTime() - new Date(selectedEvent.start_time).getTime()) / (1000 * 60))} minutes
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">
                        {selectedEvent.attendee_count} attending
                        {selectedEvent.max_attendees && ` / ${selectedEvent.max_attendees} max`}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {selectedEvent.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600 mb-2">
                      Organized by <span className="font-medium text-gray-900">{selectedEvent.organizer.name}</span>
                    </p>
                  </div>

                  {selectedEvent.is_online && selectedEvent.meeting_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-white hover:bg-gray-50 text-blue-600 border border-blue-600"
                      onClick={() => window.open(selectedEvent.meeting_link, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Join Online
                    </Button>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleRSVP(selectedEvent.id, 'attending')}
                      className="flex-1 bg-white hover:bg-gray-50 text-green-600 border border-green-600"
                    >
                      Attend
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRSVP(selectedEvent.id, 'maybe')}
                      className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                    >
                      Maybe
                    </Button>
                  </div>

                  <Link href={`/events/${selectedEvent.id}`}>
                    <Button variant="outline" size="sm" className="w-full mb-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-300">
                      View Full Event & Discussion
                    </Button>
                  </Link>

                  {selectedEvent.community_id && (
                    <Link href={`/communities/${selectedEvent.community_id}`}>
                      <Button variant="outline" size="sm" className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300">
                        View Community
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Events ({filteredEvents.length})</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto space-y-3">
                  {filteredEvents.map(event => {
                    const status = getEventStatus(event);
                    return (
                      <div
                        key={event.id}
                        className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors border-0"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Badge className={`text-xs ${status.color}`}>
                            {status.label}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">
                            {event.event_type}
                          </Badge>
                        </div>
                        
                        <h4 className="font-medium mb-1 text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="text-gray-500">{formatEventTime(event.start_time)}</span>
                          <span className="text-gray-500">{event.attendee_count} attending</span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredEvents.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No events match your current filters.</p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFilterType("all");
                          setSearchTerm("");
                        }}
                        className="mt-2"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
import {
  Appointment,
  AppointmentStatus,
  BusinessSettings,
  Customer,
  Groomer,
  GroomingSession,
  Pet,
  Profile,
  Service,
  Payment,
  UserRole,
} from "../types";
import {
  initialAppointments,
  initialBusinessSettings,
  initialCustomers,
  initialGroomers,
  initialPets,
  initialProfiles,
  initialServices,
  initialSessions,
} from "./mock-data";

// In-memory persistent state for zero-config demonstration and immediate test runs
class DataStore {
  private services: Service[] = [...initialServices];
  private groomers: Groomer[] = [...initialGroomers];
  private profiles: Profile[] = [...initialProfiles];
  private customers: Customer[] = [...initialCustomers];
  private pets: Pet[] = [...initialPets];
  private appointments: Appointment[] = [...initialAppointments];
  private sessions: GroomingSession[] = [...initialSessions];
  private payments: Payment[] = [];
  private settings: BusinessSettings = { ...initialBusinessSettings };

  // Current session mock user for testing all 3 roles easily
  private currentRole: UserRole = "customer";
  private currentUserId: string = "u-customer-1";

  // Role switching helper for interactive testing
  public setSession(role: UserRole, userId?: string) {
    this.currentRole = role;
    if (userId) {
      this.currentUserId = userId;
    } else {
      if (role === "admin") this.currentUserId = "u-admin-1";
      else if (role === "groomer") this.currentUserId = "u-groomer-1";
      else this.currentUserId = "u-customer-1";
    }
  }

  public getSession() {
    const profile =
      this.profiles.find((p) => p.id === this.currentUserId) ||
      this.profiles[0];
    return {
      userId: this.currentUserId,
      role: this.currentRole,
      profile,
    };
  }

  public getServices(activeOnly = true): Service[] {
    return activeOnly ? this.services.filter((s) => s.is_active) : this.services;
  }

  public getServiceBySlug(slug: string): Service | undefined {
    return this.services.find((s) => s.slug === slug);
  }

  public saveService(service: Service): Service {
    const idx = this.services.findIndex((s) => s.id === service.id);
    if (idx >= 0) {
      this.services[idx] = service;
    } else {
      this.services.push(service);
    }
    return service;
  }

  public getGroomers(activeOnly = true): Groomer[] {
    return activeOnly ? this.groomers.filter((g) => g.is_active) : this.groomers;
  }

  public saveGroomer(groomer: Groomer): Groomer {
    const idx = this.groomers.findIndex((g) => g.id === groomer.id);
    if (idx >= 0) {
      this.groomers[idx] = groomer;
    } else {
      this.groomers.push(groomer);
    }
    return groomer;
  }

  public getCustomers(): Customer[] {
    return this.customers;
  }

  public getCustomerByUserId(userId: string): Customer | undefined {
    return this.customers.find((c) => c.user_id === userId);
  }

  public getPetsByCustomerId(customerId: string): Pet[] {
    return this.pets.filter((p) => p.customer_id === customerId);
  }

  public getPetById(id: string): Pet | undefined {
    return this.pets.find((p) => p.id === id);
  }

  public savePet(pet: Pet): Pet {
    const idx = this.pets.findIndex((p) => p.id === pet.id);
    if (idx >= 0) {
      this.pets[idx] = pet;
    } else {
      this.pets.push(pet);
    }
    return pet;
  }

  public getAppointments(filter?: {
    customerId?: string;
    groomerId?: string;
    status?: AppointmentStatus;
    date?: string;
  }): Appointment[] {
    return this.appointments
      .filter((apt) => {
        if (filter?.customerId && apt.customer_id !== filter.customerId)
          return false;
        if (filter?.groomerId && apt.groomer_id !== filter.groomerId)
          return false;
        if (filter?.status && apt.status !== filter.status) return false;
        if (filter?.date && apt.scheduled_date !== filter.date) return false;
        return true;
      })
      .map((apt) => this.hydrateAppointment(apt))
      .sort((a, b) => (b.scheduled_date + b.start_time).localeCompare(a.scheduled_date + a.start_time));
  }

  public getAppointmentById(id: string): Appointment | undefined {
    const apt = this.appointments.find((a) => a.id === id);
    return apt ? this.hydrateAppointment(apt) : undefined;
  }

  public getAppointmentByRef(ref: string): Appointment | undefined {
    const apt = this.appointments.find((a) => a.reference_code === ref);
    return apt ? this.hydrateAppointment(apt) : undefined;
  }

  public createAppointment(data: Omit<Appointment, "id" | "created_at">): Appointment {
    // Collision detection check
    const isConflict = this.appointments.some((existing) => {
      if (existing.status === "CANCELLED") return false;
      if (existing.scheduled_date !== data.scheduled_date) return false;
      // If same groomer, check overlap
      if (data.groomer_id && existing.groomer_id === data.groomer_id) {
        return (
          data.start_time < existing.end_time && data.end_time > existing.start_time
        );
      }
      return false;
    });

    if (isConflict) {
      throw new Error(
        "Double-booking conflict: The selected groomer already has an appointment during this time slot."
      );
    }

    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      created_at: new Date().toISOString(),
      is_demo: true,
    };
    this.appointments.unshift(newApt);

    // Auto-create scheduled grooming session
    this.sessions.push({
      id: `sess-${Date.now()}`,
      appointment_id: newApt.id,
      groomer_id: newApt.groomer_id || "d0000000-0000-0000-0000-000000000001",
      pet_id: newApt.pet_id,
      status: "SCHEDULED",
      vet_referral_flag: false,
    });

    return this.hydrateAppointment(newApt);
  }

  public updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
    reason?: string
  ): Appointment {
    const apt = this.appointments.find((a) => a.id === id);
    if (!apt) throw new Error("Appointment not found");

    apt.status = status;
    if (reason) apt.cancellation_reason = reason;

    // Synchronize session status
    const sess = this.sessions.find((s) => s.appointment_id === id);
    if (sess) {
      if (status === "CHECKED_IN") sess.status = "CHECKED_IN";
      else if (status === "IN_PROGRESS") sess.status = "IN_PROGRESS";
      else if (status === "COMPLETED") sess.status = "COMPLETED";
    }

    return this.hydrateAppointment(apt);
  }

  public assignGroomer(appointmentId: string, groomerId: string): Appointment {
    const apt = this.appointments.find((a) => a.id === appointmentId);
    if (!apt) throw new Error("Appointment not found");

    // Collision check for groomer
    const conflict = this.appointments.some((other) => {
      if (other.id === appointmentId || other.status === "CANCELLED") return false;
      if (other.groomer_id !== groomerId) return false;
      if (other.scheduled_date !== apt.scheduled_date) return false;
      return apt.start_time < other.end_time && apt.end_time > other.start_time;
    });

    if (conflict) {
      throw new Error("Groomer already booked at this time.");
    }

    apt.groomer_id = groomerId;
    return this.hydrateAppointment(apt);
  }

  public getSessionByAppointmentId(appointmentId: string): GroomingSession | undefined {
    return this.sessions.find((s) => s.appointment_id === appointmentId);
  }

  public saveSession(session: GroomingSession): GroomingSession {
    const idx = this.sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      this.sessions[idx] = session;
    } else {
      this.sessions.push(session);
    }
    return session;
  }

  public getPayments(): Payment[] {
    return this.payments;
  }

  public recordPayment(payment: Omit<Payment, "id" | "created_at">): Payment {
    const newPayment: Payment = {
      ...payment,
      id: `pay-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    this.payments.unshift(newPayment);
    return newPayment;
  }

  public getSettings(): BusinessSettings {
    return this.settings;
  }

  public updateSettings(updates: Partial<BusinessSettings>): BusinessSettings {
    this.settings = { ...this.settings, ...updates };
    return this.settings;
  }

  private hydrateAppointment(apt: Appointment): Appointment {
    return {
      ...apt,
      customer: this.customers.find((c) => c.id === apt.customer_id),
      pet: this.pets.find((p) => p.id === apt.pet_id),
      groomer: this.groomers.find((g) => g.id === apt.groomer_id),
      service: this.services.find((s) => s.id === apt.service_id),
    };
  }
}

// Global singleton instance
const globalStore = new DataStore();
export default globalStore;

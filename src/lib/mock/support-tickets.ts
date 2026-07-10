import { SupportTicket } from '@/types';

export const mockSupportTickets: SupportTicket[] = [
  {
    id: "tkt_1",
    ticketNumber: "TCK-1001",
    businessId: "biz_1",
    businessName: "Desai Foods & Catering",
    branchName: "Main Branch",
    contactPerson: "Rahul Desai",
    contactEmail: "rahul@desaifoods.com",
    subject: "POS crashing during checkout",
    description: "The Point of Sale application completely freezes and then crashes when we try to apply a discount to an order with more than 10 items. This happens constantly on our primary terminal.",
    category: "technical",
    subCategory: "App Crash",
    status: "escalated",
    priority: "critical",
    assignedTo: "Sarah Jenkins",
    assignedTeam: "Technical Lead",
    slaDeadline: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago (breached)
    slaBreached: true,
    messages: [
      {
        id: "msg_1",
        senderId: "cust_1",
        senderName: "Rahul Desai",
        senderRole: "customer",
        content: "The POS app keeps crashing during peak hours when applying discounts to large orders. Please help ASAP!",
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
      {
        id: "msg_2",
        senderId: "agent_1",
        senderName: "David Chen",
        senderRole: "support_agent",
        content: "Hi Rahul, I'm sorry to hear that. Could you confirm which version of the POS app you are running on that terminal?",
        createdAt: new Date(Date.now() - 170000000).toISOString(),
      },
      {
        id: "msg_3",
        senderId: "cust_1",
        senderName: "Rahul Desai",
        senderRole: "customer",
        content: "We are running version 4.2.1.",
        createdAt: new Date(Date.now() - 165000000).toISOString(),
      },
      {
        id: "msg_4",
        senderId: "sys_1",
        senderName: "System",
        senderRole: "system",
        content: "Ticket has been escalated to Technical Lead due to SLA breach on resolution time.",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      }
    ],
    internalNotes: [
      {
        id: "note_1",
        authorId: "agent_1",
        authorName: "David Chen",
        content: "Customer is very frustrated. Checked logs, memory leak suspected in the discount module of v4.2.1.",
        createdAt: new Date(Date.now() - 160000000).toISOString(),
      }
    ],
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "tkt_2",
    ticketNumber: "TCK-1002",
    businessId: "biz_2",
    businessName: "TechHub Retail",
    contactPerson: "Anita Patel",
    contactEmail: "anita@techhub.in",
    subject: "Need GST invoice for last month's subscription",
    description: "I haven't received the tax invoice for our enterprise subscription payment made on the 5th of this month. Can you please provide it?",
    category: "billing",
    subCategory: "Invoice Request",
    status: "resolved",
    priority: "medium",
    assignedTo: "Finance Team",
    slaBreached: false,
    messages: [
      {
        id: "msg_5",
        senderId: "cust_2",
        senderName: "Anita Patel",
        senderRole: "customer",
        content: "Need the GST invoice for the recent payment.",
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: "msg_6",
        senderId: "agent_2",
        senderName: "Priya Sharma",
        senderRole: "support_agent",
        content: "Hi Anita, I have generated the invoice and attached it to this message. Let me know if you need anything else.",
        attachments: ["Invoice_TechHub_Oct.pdf"],
        createdAt: new Date(Date.now() - 43200000).toISOString(),
      }
    ],
    internalNotes: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 43200000).toISOString(),
    resolvedAt: new Date(Date.now() - 43200000).toISOString(),
    csatScore: 5,
  },
  {
    id: "tkt_3",
    ticketNumber: "TCK-1003",
    businessId: "biz_3",
    businessName: "GreenGrocer Plus",
    contactPerson: "Mohammed Ali",
    contactEmail: "m.ali@greengrocer.com",
    subject: "Barcode scanner not connecting via bluetooth",
    description: "The newly purchased Zebra barcode scanner is not pairing with the iPad running the POS app.",
    category: "hardware",
    status: "in_progress",
    priority: "high",
    assignedTo: "David Chen",
    assignedTeam: "L1 Support",
    slaDeadline: new Date(Date.now() + 7200000).toISOString(), // due in 2 hours
    slaBreached: false,
    messages: [
      {
        id: "msg_7",
        senderId: "cust_3",
        senderName: "Mohammed Ali",
        senderRole: "customer",
        content: "Bluetooth scanner won't connect.",
        createdAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
      }
    ],
    internalNotes: [],
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
  }
];

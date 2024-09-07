import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export default function FAQ() {
    const faqs = [
      {
        question: "What is TaskBuddy?",
        answer: "TaskBuddy is a time-banking platform where users exchange time to help each other with daily chores or errands. Instead of money, the currency is time."
      },
      {
        question: "How does time-banking work?",
        answer: "When you help someone with a task, you earn time credits. You can then use these credits to get help from others in the community. One hour of work equals one time credit, regardless of the task."
      },
      {
        question: "What kind of tasks can I find on TaskBuddy?",
        answer: "TaskBuddy supports a wide range of tasks, from gardening and home repairs to tutoring and pet-sitting. Any skill you have can be valuable to someone else in the community."
      },
      {
        question: "Is TaskBuddy free to use?",
        answer: "Yes, TaskBuddy is free to join and use. The only currency exchanged is time."
      },
      {
        question: "How do I get started?",
        answer: "Simply sign up for an account, list your skills, and start browsing available tasks. You can also post tasks you need help with."
      }
    ]
  
    return (
      <div className="container mx-auto pt-20 px-4">
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    )
  }
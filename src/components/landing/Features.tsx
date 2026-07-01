"use client";

import { ProgressIndicator } from "./showcase/ProgressIndicator";
import { ShowcaseContainer } from "./showcase/ShowcaseContainer";
import { MessagingShowcase } from "./showcase/MessagingShowcase";
import { StoriesShowcase } from "./showcase/StoriesShowcase";
import { FeedShowcase } from "./showcase/FeedShowcase";
import { CommunitiesShowcase } from "./showcase/CommunitiesShowcase";
import { AuthenticationShowcase } from "./showcase/AuthenticationShowcase";
import { CreatorToolsShowcase } from "./showcase/CreatorToolsShowcase";
import { AIDiscoveryShowcase } from "./showcase/AIDiscoveryShowcase";
import { CTASection } from "./showcase/CTASection";

export function Features() {
  return (
    <section id="features" className="relative z-10 flex flex-col w-full">
      
      <ProgressIndicator />

      <ShowcaseContainer 
         featureId="messaging"
         title="Conversations that feel alive."
         description="Experience instant, ultra-low latency connections. No waiting, no refreshing. Just fluid, uninterrupted conversations."
         align="left"
      >
         <MessagingShowcase />
      </ShowcaseContainer>

      <ShowcaseContainer 
         featureId="stories"
         title="Share moments instantly."
         description="Share fleeting moments with high fidelity. Immerse yourself in full-screen experiences that feel native and fast."
         align="right"
      >
         <StoriesShowcase />
      </ShowcaseContainer>

      <ShowcaseContainer 
         featureId="feed"
         title="Your world. Your people."
         description="A beautifully animated social feed designed for engagement. Smooth scrolling, instant likes, and a layout that breathes."
         align="left"
      >
         <FeedShowcase />
      </ShowcaseContainer>

      <ShowcaseContainer 
         featureId="communities"
         title="Find people who think like you."
         description="Find your tribe. Watch your network expand as you connect with specialized groups in a dynamically growing ecosystem."
         align="right"
      >
         <CommunitiesShowcase />
      </ShowcaseContainer>

      <ShowcaseContainer 
         featureId="auth"
         title="Security without friction."
         description="Enterprise-grade security protecting your data. Seamless login flows with biometric and OTP support built-in."
         align="left"
      >
         <AuthenticationShowcase />
      </ShowcaseContainer>

      <ShowcaseContainer 
         featureId="creator"
         title="Grow with confidence."
         description="Everything you need to build your audience. Deep analytics, growth tracking, and powerful insights at a glance."
         align="right"
      >
         <CreatorToolsShowcase />
      </ShowcaseContainer>

      <ShowcaseContainer 
         featureId="ai"
         title="Discover what matters."
         description="AI-powered recommendations surface the conversations, communities, and creators you'll care about most. Launching soon."
         align="left"
      >
         <AIDiscoveryShowcase />
      </ShowcaseContainer>

      <CTASection />

    </section>
  );
}

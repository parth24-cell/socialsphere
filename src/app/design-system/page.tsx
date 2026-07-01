import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { StoryRing } from "@/components/design-system/StoryRing";
import { MessageBubble } from "@/components/design-system/MessageBubble";
import { PostContainer } from "@/components/design-system/PostContainer";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-10 font-sans selection:bg-primary/30">
      <div className="max-w-5xl mx-auto space-y-20">
        <header className="space-y-4">
          <h1 className="text-4xl font-heading font-semibold text-white tracking-tight">
            SocialSphere Design System
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            A comprehensive reference for the premium, dark-mode-first component library.
          </p>
        </header>

        {/* Tokens & Colors */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold border-b border-white/10 pb-2">
            1. Color Tokens
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ColorSwatch name="Background" value="bg-background" hex="#020205" />
            <ColorSwatch name="Card Surface" value="bg-card" hex="#0a0a0f" />
            <ColorSwatch name="Primary (Amber)" value="bg-primary" hex="#f59e0b" />
            <ColorSwatch name="Muted (Slate)" value="bg-muted" hex="#0f172a" />
            <ColorSwatch name="Border" value="bg-border" hex="#1e293b" />
            <ColorSwatch name="Destructive" value="bg-destructive" hex="#ef4444" />
          </div>
        </section>

        {/* Atoms */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold border-b border-white/10 pb-2">
            2. Atoms
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-slate-300">Buttons</h3>
              <div className="flex flex-wrap gap-4 items-center p-6 rounded-2xl border border-white/10 bg-black/20">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-slate-300">Badges</h3>
              <div className="flex flex-wrap gap-4 items-center p-6 rounded-2xl border border-white/10 bg-black/20">
                <Badge>Primary</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-slate-300">Inputs</h3>
              <div className="max-w-md p-6 rounded-2xl border border-white/10 bg-black/20 space-y-4">
                <Input placeholder="Default input..." />
                <Input placeholder="Disabled input..." disabled />
                <Input placeholder="Error input..." aria-invalid />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-slate-300">Avatars</h3>
              <div className="flex flex-wrap gap-6 items-center p-6 rounded-2xl border border-white/10 bg-black/20">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar className="w-14 h-14">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar className="w-20 h-20">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </section>

        {/* Molecules */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold border-b border-white/10 pb-2">
            3. Molecules
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-slate-300">Card</h3>
              <div className="p-6 rounded-2xl border border-white/10 bg-black/20">
                <Card className="max-w-md">
                  <CardHeader>
                    <CardTitle>Premium Card</CardTitle>
                    <CardDescription>
                      This card uses a heavy glass backdrop blur and a thin translucent border.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-300">
                      The content area is clean and legible against the dark background.
                    </p>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button variant="outline">Cancel</Button>
                    <Button className="ml-2">Confirm</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-slate-300">Story Rings</h3>
              <div className="flex flex-wrap gap-6 items-center p-6 rounded-2xl border border-white/10 bg-black/20">
                <StoryRing fallback="A" size="sm" />
                <StoryRing fallback="B" size="md" />
                <StoryRing fallback="C" size="lg" />
                <StoryRing fallback="D" size="md" hasUnviewedStory={false} />
              </div>
            </div>
          </div>
        </section>

        {/* Organisms */}
        <section className="space-y-8">
          <h2 className="text-2xl font-semibold border-b border-white/10 pb-2">
            4. Organisms
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-slate-300">Message Bubbles</h3>
              <div className="max-w-xl p-6 rounded-2xl border border-white/10 bg-black/20 space-y-6 flex flex-col">
                <MessageBubble
                  content="Hey! Are we still on for the design review later?"
                  isSender={false}
                  avatarFallback="AL"
                  timestamp="10:42 AM"
                />
                <MessageBubble
                  content="Absolutely. I just pushed the new design system to the repo. Have a look!"
                  isSender={true}
                  timestamp="10:44 AM"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-slate-300">Post Container</h3>
              <div className="max-w-xl rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
                <PostContainer
                  authorName="Jane Doe"
                  authorHandle="janedoe"
                  avatarFallback="JD"
                  timestamp="2h ago"
                  content="Just finished the new design system for SocialSphere. The amber accents on top of the deep slate backgrounds look incredible. 🚀✨"
                  likes={124}
                  comments={18}
                  shares={5}
                  isLiked={true}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ColorSwatch({ name, value, hex }: { name: string; value: string; hex: string }) {
  return (
    <div className="space-y-2">
      <div
        className={`w-full h-24 rounded-xl border border-white/10 shadow-lg ${value}`}
      />
      <div>
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-muted-foreground uppercase">{hex}</p>
      </div>
    </div>
  );
}

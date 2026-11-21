import {
  Video,
  Users2,
  Monitor,
  FileText,
  BookOpen,
  ClipboardList,
  MessagesSquare,
  ArrowRight,
} from "lucide-react";
import JoinLiveClass from "@/components/JoinLiveClass";
import RecordedLecturesGrid from "@/components/RecordedLecturesGrid";
import CTABanner from "@/components/CTABanner";
import PageHero from "@/components/PageHero";
import { onlineClassFeatures, courses } from "@/lib/data";
import { getLiveClasses, getRecordedLectures } from "@/lib/content";
import { courseIconMap, courseChipColors } from "@/lib/courseVisuals";

const featureIcons = [Video, FileText, BookOpen, ClipboardList, MessagesSquare];

function courseFor(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export default async function OnlineClassPage() {
  const [liveClasses, recordedLectures] = await Promise.all([getLiveClasses(), getRecordedLectures()]);
  return (
    <>
      {/* Hero */}
      <PageHero
        breadcrumb="Home > Online Class"
        title={
          <>
            Learn From Anywhere,
            <br />
            <span className="text-gold">Achieve Everywhere</span>
          </>
        }
        description="Join live interactive classes, access recorded lectures, and learn at your own pace with FSTI Online."
        image="/images/online-class-hero.png"
        mobileImage="/images/online-class-hero-mobile.png"
        alt="FSTI Online Classes — live sessions, recorded lectures, learn anytime anywhere"
        theme="light"
        focus="62% center"
        chips={[
          { icon: Video, label: "Live Interactive Classes" },
          { icon: Users2, label: "Expert Instructors" },
          { icon: Monitor, label: "Learn from Any Device" },
        ]}
      />

      {/* Feature cards */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-8 md:mt-10 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {onlineClassFeatures.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <div
                key={f.title}
                className="bg-white rounded-xl border border-black/5 shadow-md shadow-navy/5 p-5"
              >
                <span className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center mb-3">
                  <Icon size={16} className="text-navy" />
                </span>
                <p className="font-semibold text-navy text-sm mb-1">{f.title}</p>
                <p className="text-xs text-navy/50 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live classes + join panel */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 md:p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-navy text-xl">Live Interactive Classes</h2>
            <a href="#" className="text-sm font-semibold text-navy/60 hover:text-navy">
              View All
            </a>
          </div>

          <div className="divide-y divide-black/5">
            {liveClasses.map((lc) => {
              const course = courseFor(lc.courseSlug);
              const Icon = course ? courseIconMap[course.icon] : Video;
              return (
                <div
                  key={lc.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
                >
                  <span
                    className={`w-14 h-14 rounded-lg ${
                      course ? courseChipColors[course.icon] : "bg-slate-600"
                    } flex items-center justify-center text-white shrink-0`}
                  >
                    <Icon size={22} />
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="font-semibold text-navy text-sm">{lc.title}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> LIVE
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gold-dark mb-0.5">
                      {course?.title ?? "General"}
                    </p>
                    <p className="text-xs text-navy/45">
                      Instructor: {lc.instructor} &nbsp;•&nbsp; {lc.time}
                    </p>
                  </div>

                  <div className="text-center sm:text-right shrink-0">
                    <p className="font-display font-bold text-navy text-lg leading-none">
                      {lc.studentsOnline}
                    </p>
                    <p className="text-[10px] text-navy/40">Students Online</p>
                  </div>

                  <button className="bg-navy hover:bg-navy-light text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shrink-0">
                    Join Now
                  </button>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold-dark transition-colors"
            >
              View Full Schedule <ArrowRight size={14} />
            </a>
          </div>
        </div>

        <JoinLiveClass />
      </section>

      {/* Recorded lectures */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <RecordedLecturesGrid recordedLectures={recordedLectures} />
      </section>

      <section className="pb-20">
        <CTABanner
          title="Start Learning Today!"
          subtitle="Join thousands of students and take the next step toward your success."
          buttonLabel="Explore Courses"
          href="/courses"
        />
      </section>
    </>
  );
}

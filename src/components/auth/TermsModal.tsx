"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const TermsModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:underline text-sm"
      >
        Terms of Service
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogDescription>
              Please read these Terms of Service carefully before using our
              Content Generator service.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(80vh - 200px)] p-4 rounded-md border">
            <div className="space-y-4 text-sm text-gray-700">
              <h2 className="text-lg font-semibold">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Content Generator service (Service),
                provided by [Your Company Name] (we, us, or our), you agree to
                be bound by these Terms of Service (Terms). If you disagree with
                any part of the terms, then you may not access the Service.
              </p>

              <h2 className="text-lg font-semibold">2. Account Registration</h2>
              <p>
                To access certain features of the Service, you may be required
                to register for an account. You agree to provide accurate,
                current, and complete information during the registration
                process and to update such information to keep it accurate,
                current, and complete. You are responsible for safeguarding the
                password that you use to access the Service and for any
                activities or actions under your account.
              </p>

              <h2 className="text-lg font-semibold">3. Use of Service</h2>
              <p>
                The Service is intended for generating content for various
                purposes. You agree to use the Service only for lawful purposes
                and in accordance with these Terms and all applicable laws and
                regulations. You are solely responsible for the content you
                generate through the Service.
              </p>

              <h2 className="text-lg font-semibold">4. Prohibited Conduct</h2>
              <p>
                You agree not to engage in any of the following prohibited
                activities:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Using the Service for any illegal purpose, or in violation of
                  any local, state, national, or international law.
                </li>
                <li>
                  Impersonating any person or entity, or falsely stating or
                  otherwise misrepresenting your affiliation with a person or
                  entity.
                </li>
                <li>
                  Interfering with or disrupting the operation of the Service or
                  the servers or networks used to make the Service available.
                </li>
                <li>
                  Attempting to gain unauthorized access to any portion or
                  feature of the Service, or any other systems or networks
                  connected to the Service.
                </li>
                <li>
                  Using any robot, spider, site search/retrieval application, or
                  other device to retrieve or index any portion of the Service.
                </li>
                <li>
                  Generating or distributing content that is unlawful, harmful,
                  threatening, abusive, harassing, tortious, defamatory, vulgar,
                  obscene, libelous, invasive of another privacy, hateful, or
                  racially, ethnically, or otherwise objectionable.
                </li>
                <li>
                  Violating or infringing upon the rights of others, including
                  patent, trademark, trade secret, copyright, or other
                  proprietary rights.
                </li>
              </ul>

              <h2 className="text-lg font-semibold">
                5. Intellectual Property
              </h2>
              <p>
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of
                [Your Company Name] and its licensors. The Service is protected
                by copyright, trademark, and other laws of both the [Country]
                and foreign countries. Our trademarks and trade dress may not be
                used in connection with any product or service without the prior
                written consent of [Your Company Name].
              </p>
              <p>
                You retain ownership of the content you generate using the
                Service. However, by using the Service, you grant us a
                non-exclusive, worldwide, royalty-free license to use, modify,
                perform, display, and distribute the content solely for the
                purpose of providing and improving the Service.
              </p>

              <h2 className="text-lg font-semibold">
                6. Disclaimer of Warranties
              </h2>
              <p>
                THE SERVICE IS PROVIDED ON AN AS IS AND AS AVAILABLE BASIS.
                [YOUR COMPANY NAME] MAKES NO WARRANTIES, EXPRESSED OR IMPLIED,
                AND HEREBY DISCLAIMS AND NEGATES ALL OTHER WARRANTIES, INCLUDING
                WITHOUT LIMITATION, IMPLIED WARRANTIES OR CONDITIONS OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
                NON-INFRINGEMENT OF INTELLECTUAL PROPERTY OR OTHER VIOLATION OF
                RIGHTS. FURTHER, [YOUR COMPANY NAME] DOES NOT WARRANT OR MAKE
                ANY REPRESENTATIONS CONCERNING THE ACCURACY, LIKELY RESULTS, OR
                RELIABILITY OF THE USE OF THE SERVICE OR OTHERWISE RELATING TO
                SUCH MATERIALS OR ON ANY SITES LINKED TO THIS SERVICE.
              </p>

              <h2 className="text-lg font-semibold">
                7. Limitation of Liability
              </h2>
              <p>
                IN NO EVENT SHALL [YOUR COMPANY NAME], NOR ITS DIRECTORS,
                EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE
                FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE
                DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA,
                USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (i)
                YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE
                SERVICE; (ii) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE
                SERVICE; (iii) ANY CONTENT OBTAINED FROM THE SERVICE; AND (iv)
                UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR TRANSMISSIONS OR
                CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING
                NEGLIGENCE) OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE
                BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE, AND EVEN IF A
                REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL
                PURPOSE.
              </p>

              <h2 className="text-lg font-semibold">8. Indemnification</h2>
              <p>
                You agree to indemnify, defend and hold harmless [Your Company
                Name], its officers, directors, employees, agents and third
                parties, for any losses, costs, liabilities and expenses
                (including reasonable attorneys fees) relating to or arising out
                of your use of or inability to use the Service, your violation
                of these Terms, or your violation of any rights of a third
                party, or your violation of any applicable laws, rules or
                regulations.
              </p>

              <h2 className="text-lg font-semibold">9. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with
                the laws of [Your Country/State], without regard to its conflict
                of law provisions.
              </p>

              <h2 className="text-lg font-semibold">10. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will try to provide at least 30 days notice prior to any new
                terms taking effect. What constitutes a material change will be
                determined at our sole discretion. By continuing to access or
                use our Service after those revisions become effective, you
                agree to be bound by the revised terms. If you do not agree to
                the new terms, please stop using the Service.
              </p>

              <h2 className="text-lg font-semibold">11. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us
                at:{" "}
                <a
                  href="mailto:[Your Contact Email]"
                  className="text-blue-600 hover:underline"
                >
                  [Your Contact Email]
                </a>
              </p>

              <p className="mt-4">
                By clicking Sign Up or using our Service, you acknowledge that
                you have read, understood, and agree to be bound by these Terms
                of Service.
              </p>
            </div>
          </ScrollArea>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TermsModal;
